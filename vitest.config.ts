import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react({
      // Apply the same SWC transform in tests so SWC is actually exercised
      // end-to-end (and we don't get the "no swc plugins are used" warning).
      plugins: [
        [
          '@swc/plugin-react-remove-properties',
          {
            properties: ['/^data-testid$/', '/^data-test/', '/^data-cy$/'],
          },
        ],
      ],
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/test-setup.ts'],
  },
});
