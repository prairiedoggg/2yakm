import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePluginStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePluginStaticCopy({
      targets: [
        {
          src: 'src/assets/img/**/*',
          dest: 'img'
        }
      ]
    })
  ]
});
