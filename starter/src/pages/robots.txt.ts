import type { APIRoute } from 'astro';
import { site } from '@/config/site';

export const GET: APIRoute = () => {
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /thank-you/', '', `Sitemap: ${site.url}/sitemap-index.xml`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
