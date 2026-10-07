import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://minepedia.app',
  output: 'static',
  build: { format: 'directory' },
  trailingSlash: 'always',
  integrations: [sitemap()],
});
