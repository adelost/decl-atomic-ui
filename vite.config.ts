import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { scenesPlugin, metaPlugin } from '@motion-canvas/vite-plugin/lib/partials'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for GitHub Pages
  base: '/declarative-ui/',
  plugins: [
    svelte(),
    // Motion Canvas scene transformation (without full editor)
    scenesPlugin(),
    metaPlugin(),
  ],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
})
