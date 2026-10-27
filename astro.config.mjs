// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://thomasrobertsrealty.co',
  redirects: { '/fsbo-help': '/first-time-buyers' },
  integrations: [
    react(),
    // Keep the private login pages out of the sitemap.
    sitemap({ filter: (page) => !page.includes('/my-plan') && !page.includes('/admin') }),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});