import { getCollection } from 'astro:content';
import caseStudiesData from '../data/case-studies.json';
import platformsData from '../data/platforms.json';

export async function GET() {
  const siteUrl = 'https://hashbooks.site';

  // 1. Static Pages
  const staticPages = [
    '/',
    '/about/',
    '/pricing/',
    '/contact/',
    '/faq/',
    '/get-a-quote/',
    '/privacy-policy/',
    '/terms-of-service/',
    '/services/',
    '/case-studies/',
    '/blog/'
  ];

  // 2. Services Pages
  const servicesPages = [
    '/services/bookkeeping/',
    '/services/accounts-payable-receivable/',
    '/services/payroll/',
    '/services/tax-preparation/',
    '/services/financial-reporting/',
    '/services/cfo-advisory/',
    '/services/catch-up-bookkeeping/',
    '/services/cloud-integration/'
  ];

  // 3. Dynamic Pages from Content Collections & JSON Data
  const blogPosts = await getCollection('blog');
  const blogUrls = blogPosts
    .filter(post => !post.data.draft)
    .map(post => `/blog/${post.id}/`);

  const caseStudyUrls = caseStudiesData.map(item => `/case-studies/${item.slug}/`);
  const platformUrls = platformsData.map(item => `/platforms/${item.slug}/`);

  // Combine all paths
  const allPaths = [
    ...staticPages,
    ...servicesPages,
    ...blogUrls,
    ...caseStudyUrls,
    ...platformUrls
  ];

  // Create unique, absolute URLs
  const uniqueUrls = [...new Set(allPaths)].map(path => `${siteUrl}${path}`);

  // Generate XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${uniqueUrls
    .map(
      url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.endsWith('hashbooks.site/') ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
