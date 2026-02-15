import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

/** API base URL: full URL (e.g. http://localhost:3000) or proxy path (e.g. /api) */
const apiUrlSchema = z.union([
  z.string().regex(/^\/.+/, 'Relative path must start with /'),
  z.string().url(),
]);

export const env = createEnv({
  /*
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  clientPrefix: 'VITE_',
  server: {},
  client: {
    VITE_API_URL: apiUrlSchema,
    VITE_APP_ENV: z.string().min(1),
  },
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnvStrict: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
  },
});
