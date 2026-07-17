import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://trollheap.github.io',
  base: '/ck3-docs/',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
