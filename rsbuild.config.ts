import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  output: {
    distPath: {
      root: 'dist', 
    },
    assetPrefix:
      process.env.NODE_ENV === 'production'
        ? '/jerfilm-rsbuild/'
        : '/',
  },

  plugins: [
    pluginReact({
      reactCompiler: true,
    }),
    pluginTailwindcss(),
  ],
});
