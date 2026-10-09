import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { RoomServiceClient } from 'livekit-server-sdk';

// Jobs must keep terminating existing rooms even when new calls are disabled.
export function lifecycleServices() {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
    'LIVEKIT_URL', 'LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET'] as const;
  if (!required.every(key => process.env[key]?.trim())) throw new Error('Termination services unavailable');
  return {
    db: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(8000) }) },
    }),
    live: new RoomServiceClient(process.env.LIVEKIT_URL!.replace(/^wss:/, 'https:'),
      process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, { requestTimeout: 8 }),
  };
}
