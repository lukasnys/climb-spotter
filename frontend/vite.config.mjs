import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';

export default defineConfig(({ mode }) => {
  const config = {
    plugins: [
      classicEmberSupport(),
      ember(),
      // extra plugins here
      babel({
        babelHelpers: 'runtime',
        extensions,
      }),
    ],
  };

  if (mode === 'development') {
    config.server = {
      proxy: {
        '/api': {
          target: 'http://localhost:8788',
          changeOrigin: true,
        },
      },
    };
  }

  return config;
});
