import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'
import svgr from "vite-plugin-svgr";
import * as path from "node:path";


// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", 
    open: true
  },
  plugins: [
    react(),
    svgr(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],

    resolve: {
    alias: {
      "~~": path.resolve(__dirname, "./src/components"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
})
