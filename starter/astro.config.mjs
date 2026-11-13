import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { site, siteType } from './src/config/site.ts';

// Pages that only belong in the sitemap when the site is a multi-page "website".
const innerPages = ['/about/', '/services/', '/contact/'];
const neverIndexed = ['/thank-you/'];

// Dev-only wireframe route. injectRoute runs only when the command is `dev`,
// so `astro build` never emits /wireframe (scripts/check-dist.mjs asserts it).
const wireframeDev = {
  name: 'wireframe-dev-route',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command !== 'dev') return;
      injectRoute({ pattern: '/wireframe', entrypoint: './src/dev/wireframe.astro' });
    },
  },
};

export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: {
    // CSP is style-src 'self': no inline <style>. Keep every stylesheet external.
    inlineStylesheets: 'never',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        if (neverIndexed.includes(path)) return false;
        if (siteType !== 'website' && innerPages.includes(path)) return false;
        return true;
      },
    }),
    wireframeDev,
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // No source maps in production: your source must not be one click away in DevTools.
      sourcemap: false,
      // CSP is font-src 'self' / script-src 'self': never inline assets as data: URIs or inline scripts.
      assetsInlineLimit: 0,
    },
  },
});
