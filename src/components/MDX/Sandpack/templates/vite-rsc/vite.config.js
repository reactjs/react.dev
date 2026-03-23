import react from '@vitejs/plugin-react';
import rsc from '@vitejs/plugin-rsc';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [rsc(), react()],

  environments: {
    rsc: {
      build: {
        rollupOptions: {
          input: {
            index: './src/framework/entry.rsc.jsx',
          },
        },
      },
    },

    ssr: {
      build: {
        rollupOptions: {
          input: {
            index: './src/framework/entry.ssr.jsx',
          },
        },
      },
    },

    client: {
      build: {
        rollupOptions: {
          input: {
            index: './src/framework/entry.browser.jsx',
          },
        },
      },
    },
  },
});
