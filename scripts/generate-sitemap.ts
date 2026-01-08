import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { tools } from '../src/tools';
import { config } from '../src/config';

// Create a simple router to get all routes
const tempRouter = createRouter({
  history: createWebHistory(config.app.baseUrl),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
    ...tools.map(({ path, name, component, ...config }) => ({
      path,
      name,
      component: { template: `<div>${name}</div>` },
      meta: { isTool: true, name, ...config },
    })),
  ],
});

// Generate sitemap
async function generateSitemap() {
  // Wait for router to be ready
  await tempRouter.isReady();

  const baseUrl = 'https://tools.toolkitlife.com'; // Production URL
  const lastmod = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add home page
  sitemap += `
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Add about page
  sitemap += `
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Add all tool pages
  tools.forEach(tool => {
    sitemap += `
  <url>
    <loc>${baseUrl}${tool.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  sitemap += '\n</urlset>';

  console.log(sitemap);
  return sitemap;
}

// Export for use in build process
export { generateSitemap };

// Also run directly if called from command line
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}