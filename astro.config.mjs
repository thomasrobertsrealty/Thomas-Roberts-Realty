// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://idahoforsalebyowner.com',
  redirects: { '/fsbo-help': '/first-time-buyers' },
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});