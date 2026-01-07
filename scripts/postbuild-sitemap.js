const { writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

// Define all the routes manually based on what we found in the code
const routes = [
  { path: '/', name: 'home', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', name: 'about', changefreq: 'monthly', priority: '0.8' },
  // Tools routes
  { path: '/base64-file-converter', name: 'base64FileConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/base64-string-converter', name: 'base64StringConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/hash-text', name: 'hashText', changefreq: 'weekly', priority: '0.9' },
  { path: '/bcrypt', name: 'bcrypt', changefreq: 'weekly', priority: '0.9' },
  { path: '/uuid-generator', name: 'uuidGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/ulid-generator', name: 'ulidGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/token-generator', name: 'tokenGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/cypher', name: 'cypher', changefreq: 'weekly', priority: '0.9' },
  { path: '/password-strength-analyser', name: 'passwordStrengthAnalyser', changefreq: 'weekly', priority: '0.9' },
  { path: '/bip39', name: 'bip39', changefreq: 'weekly', priority: '0.9' },
  { path: '/rsa-key-pair-generator', name: 'rsaKeyPairGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/hmac-generator', name: 'hmacGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/pdf-signature-checker', name: 'pdfSignatureChecker', changefreq: 'weekly', priority: '0.9' },
  { path: '/date-time-converter', name: 'dateTimeConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/base-converter', name: 'baseConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/roman-numeral-converter', name: 'romanNumeralConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/color-converter', name: 'colorConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/case-converter', name: 'caseConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-yaml-converter', name: 'jsonYamlConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/yaml-json-converter', name: 'yamlJsonConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-csv-converter', name: 'jsonCsvConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/csv-json-converter', name: 'csvJsonConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-formatter', name: 'jsonFormatter', changefreq: 'weekly', priority: '0.9' },
  { path: '/xml-formatter', name: 'xmlFormatter', changefreq: 'weekly', priority: '0.9' },
  { path: '/html-entities-encoder', name: 'htmlEntitiesEncoder', changefreq: 'weekly', priority: '0.9' },
  { path: '/html-entities-decoder', name: 'htmlEntitiesDecoder', changefreq: 'weekly', priority: '0.9' },
  { path: '/html-minify', name: 'htmlMinify', changefreq: 'weekly', priority: '0.9' },
  { path: '/html-beautify', name: 'htmlBeautify', changefreq: 'weekly', priority: '0.9' },
  { path: '/css-minify', name: 'cssMinify', changefreq: 'weekly', priority: '0.9' },
  { path: '/css-beautify', name: 'cssBeautify', changefreq: 'weekly', priority: '0.9' },
  { path: '/js-minify', name: 'jsMinify', changefreq: 'weekly', priority: '0.9' },
  { path: '/js-beautify', name: 'jsBeautify', changefreq: 'weekly', priority: '0.9' },
  { path: '/sql-minify', name: 'sqlMinify', changefreq: 'weekly', priority: '0.9' },
  { path: '/sql-beautify', name: 'sqlBeautify', changefreq: 'weekly', priority: '0.9' },
  { path: '/qr-code-generator', name: 'qrCodeGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/qr-code-scanner', name: 'qrCodeScanner', changefreq: 'weekly', priority: '0.9' },
  { path: '/text-diff', name: 'textDiff', changefreq: 'weekly', priority: '0.9' },
  { path: '/text-statistics', name: 'textStatistics', changefreq: 'weekly', priority: '0.9' },
  { path: '/lorem-ipsum-generator', name: 'loremIpsumGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/password-generator', name: 'passwordGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/password-meter', name: 'passwordMeter', changefreq: 'weekly', priority: '0.9' },
  { path: '/image-converter', name: 'imageConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/image-resize', name: 'imageResize', changefreq: 'weekly', priority: '0.9' },
  { path: '/image-compress', name: 'imageCompress', changefreq: 'weekly', priority: '0.9' },
  { path: '/favicon-generator', name: 'faviconGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/svg-placeholder', name: 'svgPlaceholder', changefreq: 'weekly', priority: '0.9' },
  { path: '/svg-to-css', name: 'svgToCss', changefreq: 'weekly', priority: '0.9' },
  { path: '/svg-to-png', name: 'svgToPng', changefreq: 'weekly', priority: '0.9' },
  { path: '/svg-to-jpg', name: 'svgToJpg', changefreq: 'weekly', priority: '0.9' },
  { path: '/svg-to-webp', name: 'svgToWebp', changefreq: 'weekly', priority: '0.9' },
  { path: '/svg-to-ico', name: 'svgToIco', changefreq: 'weekly', priority: '0.9' },
  { path: '/svg-to-txt', name: 'svgToTxt', changefreq: 'weekly', priority: '0.9' },
  { path: '/text-to-speech', name: 'textToSpeech', changefreq: 'weekly', priority: '0.9' },
  { path: '/url-encoder', name: 'urlEncoder', changefreq: 'weekly', priority: '0.9' },
  { path: '/url-decoder', name: 'urlDecoder', changefreq: 'weekly', priority: '0.9' },
  { path: '/url-parser', name: 'urlParser', changefreq: 'weekly', priority: '0.9' },
  { path: '/url-builder', name: 'urlBuilder', changefreq: 'weekly', priority: '0.9' },
  { path: '/jwt-parser', name: 'jwtParser', changefreq: 'weekly', priority: '0.9' },
  { path: '/jwt-generator', name: 'jwtGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/jwt-signer', name: 'jwtSigner', changefreq: 'weekly', priority: '0.9' },
  { path: '/jwt-verifier', name: 'jwtVerifier', changefreq: 'weekly', priority: '0.9' },
  { path: '/regex-tester', name: 'regexTester', changefreq: 'weekly', priority: '0.9' },
  { path: '/ip-geolocation', name: 'ipGeolocation', changefreq: 'weekly', priority: '0.9' },
  { path: '/network-info', name: 'networkInfo', changefreq: 'weekly', priority: '0.9' },
  { path: '/mac-address-lookup', name: 'macAddressLookup', changefreq: 'weekly', priority: '0.9' },
  { path: '/subnet-calculator', name: 'subnetCalculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/certificate-info', name: 'certificateInfo', changefreq: 'weekly', priority: '0.9' },
  { path: '/certificate-parser', name: 'certificateParser', changefreq: 'weekly', priority: '0.9' },
  { path: '/certificate-generator', name: 'certificateGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/certificate-signer', name: 'certificateSigner', changefreq: 'weekly', priority: '0.9' },
  { path: '/certificate-verifier', name: 'certificateVerifier', changefreq: 'weekly', priority: '0.9' },
  { path: '/ssh-key-generator', name: 'sshKeyGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/ssh-key-parser', name: 'sshKeyParser', changefreq: 'weekly', priority: '0.9' },
  { path: '/ssh-key-fingerprint', name: 'sshKeyFingerprint', changefreq: 'weekly', priority: '0.9' },
  { path: '/ssh-key-converter', name: 'sshKeyConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/ssh-config-validator', name: 'sshConfigValidator', changefreq: 'weekly', priority: '0.9' },
  { path: '/ssh-tunnel', name: 'sshTunnel', changefreq: 'weekly', priority: '0.9' },
  { path: '/ssh-client', name: 'sshClient', changefreq: 'weekly', priority: '0.9' },
  { path: '/ssh-server', name: 'sshServer', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-tips', name: 'gitTips', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-cheat-sheet', name: 'gitCheatSheet', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-commands', name: 'gitCommands', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-diff', name: 'gitDiff', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-log', name: 'gitLog', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-status', name: 'gitStatus', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-stash', name: 'gitStash', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-branch', name: 'gitBranch', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-merge', name: 'gitMerge', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-rebase', name: 'gitRebase', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-reset', name: 'gitReset', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-checkout', name: 'gitCheckout', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-commit', name: 'gitCommit', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-add', name: 'gitAdd', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-clone', name: 'gitClone', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-pull', name: 'gitPull', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-push', name: 'gitPush', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-fetch', name: 'gitFetch', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-remote', name: 'gitRemote', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-tag', name: 'gitTag', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-submodule', name: 'gitSubmodule', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-hooks', name: 'gitHooks', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-workflow', name: 'gitWorkflow', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-lfs', name: 'gitLfs', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-lfs-config', name: 'gitLfsConfig', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-lfs-troubleshooting', name: 'gitLfsTroubleshooting', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-lfs-commands', name: 'gitLfsCommands', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-lfs-troubleshooting', name: 'gitLfsTroubleshooting', changefreq: 'weekly', priority: '0.9' },
];

const baseUrl = 'https://it-tools.tech';
const lastmod = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

// Generate the sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

routes.forEach(route => {
  sitemap += `\n  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`;
});

sitemap += '\n</urlset>';

// Ensure dist directory exists
const distPath = join(__dirname, '..', 'dist');
if (!existsSync(distPath)) {
  mkdirSync(distPath, { recursive: true });
}

// Write the sitemap to dist directory
const sitemapPath = join(distPath, 'sitemap.xml');
writeFileSync(sitemapPath, sitemap);

console.log('Sitemap generated successfully at dist/sitemap.xml');