import { defineConfig } from 'vite'
import fg from 'fast-glob';
import { viteMockServe } from 'vite-plugin-mock';
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path';

function viteWatchExternal() {
  return {
    name: 'watch-external',
    async buildStart() {
      const files = await fg(['html/**/*']);
      for (let file of files) {
        this.addWatchFile(file);
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  cssCodeSplit: true,
  server: {port: 7400},
  plugins: [vue(), viteWatchExternal(), viteMockServe({mockPath: 'mock'})],
  root: './html',
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          aceEditor: ['vue3-ace-editor'],
          aceBuilds: ['ace-builds'],
          lodash: ['lodash'],
          markdown: ['markdown-it', 'markdown-it-anchor'],
        }
      }
    }
  }
});
