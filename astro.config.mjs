import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://hashbooks.site',
  integrations: [sitemap()],
  adapter: vercel(),
  prefetch: true
});
