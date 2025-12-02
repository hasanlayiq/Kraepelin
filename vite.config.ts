import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Penting: Menggunakan path relatif agar berjalan di sub-folder GitHub Pages
  build: {
    outDir: 'dist',
  },
});