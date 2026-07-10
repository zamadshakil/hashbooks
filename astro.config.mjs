import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hashbooks.site',
  integrations: [sitemap()],
  output: 'static'
});
