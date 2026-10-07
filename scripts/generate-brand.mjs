import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const source = await readFile(new URL('lib/brand.ts', root), 'utf8');
const path = source.match(/export const YO_LOGO_PATH = '([^']+)'/)[1];
for (const [name, color] of [['yo-logo.svg', '#000000'], ['yo-logo-white.svg', '#ffffff']]) {
  await writeFile(new URL(`public/${name}`, root), `<svg xmlns="http://www.w3.org/2000/svg" width="216" height="112" viewBox="0 0 108 56" role="img" aria-label="YO"><path d="${path}" fill="${color}" fill-rule="evenodd"/></svg>\n`);
}
await writeFile(new URL('app/icon.svg', root), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="26" fill="#090e20"/><path transform="translate(10 36)" d="${path}" fill="#ffffff" fill-rule="evenodd"/></svg>\n`);
