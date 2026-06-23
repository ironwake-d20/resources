import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import campaignsPlugin from './vite-plugin-campaigns';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      tailwindcss(),
      react({
        // Make SWC “meaningful”: apply a real SWC transform.
        // This strips testing-only attributes from production builds.
        // In dev/test we keep them to avoid breaking tests and tooling.
        plugins: isProd
          ? [
              [
                '@swc/plugin-react-remove-properties',
                {
                  properties: [
                    '/^data-testid$/',
                    '/^data-test/',
                    '/^data-cy$/',
                  ],
                },
              ],
            ]
          : [],
      }),
      campaignsPlugin(),
    ],
    base: '/resources/',
    build: {
      outDir: 'dist',
    },
  };
});
