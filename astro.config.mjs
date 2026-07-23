import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hashbooks.site',
  adapter: vercel(),
  integrations: [sitemap()],
  prefetch: true,
  build: {
    inlineStylesheets: 'always'
  }
});

