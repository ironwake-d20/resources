import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import campaignsPlugin from './vite-plugin-campaigns';

export default defineConfig({
  plugins: [tailwindcss(), react(), campaignsPlugin()],
  base: '/resources/',
  build: {
    outDir: 'dist',
  },
});
