import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 4002,
    strictPort: true,
    open: true,
  },
  preview: {
    host: true,
    port: 5002,
  },
});
