import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
test('reservation migration enforces capacity, duplicates, leases, closure and least privilege', async () => {
 const db = new PGlite();
 try {
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  await db.exec(await readFile(new URL('../supabase/migrations/202610070001_voice_test.sql', import.meta.url), 'utf8'));
  const id='yo-00000000-0000-4000-8000-000000000001';
  const people=Array.from({length:9},(_,i)=>`00000000-0000-4000-8000-${String(i+1).padStart(12,'0')}`);
  await db.query("insert into public.yo_voice_rooms(id,title,capacity,host_id,invite_hash,expires_at) values($1,'Test',8,$2,'hash',now()+interval '1 hour')", [id,people[0]]);
  const reserve=async (guest,connected=[]) => (await db.query('select public.yo_voice_reserve($1,$2,$3::uuid[]) as ok',[id,guest,connected])).rows[0].ok;
  const result=await Promise.all(people.map(guest=>reserve(guest)));
  assert.equal(result.filter(Boolean).length,8); // PGlite serializes requests; real multi-connection race test is still required.
  assert.equal(await reserve(people[0]),true);
  assert.equal((await db.query('select count(*)::int as n from public.yo_voice_slots')).rows[0].n,8);
  await db.query('select public.yo_voice_release($1,$2)',[id,people[0]]);
  assert.equal(await reserve(people[8]),true);
  await db.exec("update public.yo_voice_slots set lease_until=now()-interval '1 second'");
  assert.equal(await reserve(people[0],people.slice(1)),false); // 8 live identities count even after lease expiration.
  assert.equal(await reserve(people[0],[]),true);
  await db.query('update public.yo_voice_rooms set closed=true where id=$1',[id]);
  assert.equal(await reserve(people[1]),false);
  await db.query("update public.yo_voice_rooms set closed=false,expires_at=now()-interval '1 second' where id=$1",[id]);
  assert.equal(await reserve(people[1]),false);
  for (const role of ['anon','authenticated']) {
   const permissions=(await db.query("select has_table_privilege($1,'public.yo_voice_rooms','SELECT') as read,has_function_privilege($1,'public.yo_voice_reserve(text,uuid,uuid[])','EXECUTE') as execute",[role])).rows[0];
   assert.deepEqual(permissions,{read:false,execute:false});
  }
  await db.exec('set role service_role');
  assert.equal((await db.query('select public.yo_voice_rate($1,2) as ok',['test'])).rows[0].ok,true);
  assert.equal((await db.query('select public.yo_voice_rate($1,2) as ok',['test'])).rows[0].ok,true);
  assert.equal((await db.query('select public.yo_voice_rate($1,2) as ok',['test'])).rows[0].ok,false);
 } finally { await db.close(); }
});
