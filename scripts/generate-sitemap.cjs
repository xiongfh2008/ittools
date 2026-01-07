// Simple sitemap generator
const fs = require('fs');
const path = require('path');

// Define the base URL and current date
const baseUrl = 'https://it-tools.tech';
const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

// Define all the routes manually based on what we found in the code
const routes = [
  { path: '/', name: 'home', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', name: 'about', changefreq: 'monthly', priority: '0.8' },
  // Tools routes - adding some of the main ones
  { path: '/base64-file-converter', name: 'base64FileConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/base64-string-converter', name: 'base64StringConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/basic-auth-generator', name: 'basicAuthGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/color-converter', name: 'colorConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/case-converter', name: 'caseConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/text-to-binary', name: 'textToBinary', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-to-xml', name: 'jsonToXml', changefreq: 'weekly', priority: '0.9' },
  { path: '/xml-to-json', name: 'xmlToJson', changefreq: 'weekly', priority: '0.9' },
  { path: '/regex-tester', name: 'regexTester', changefreq: 'weekly', priority: '0.9' },
  { path: '/markdown-to-html', name: 'markdownToHtml', changefreq: 'weekly', priority: '0.9' },
  { path: '/password-strength-analyser', name: 'passwordStrengthAnalyser', changefreq: 'weekly', priority: '0.9' },
  { path: '/qr-code-generator', name: 'qrCodeGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/uuid-generator', name: 'uuidGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/url-encoder', name: 'urlEncoder', changefreq: 'weekly', priority: '0.9' },
  { path: '/device-information', name: 'deviceInformation', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-viewer', name: 'jsonViewer', changefreq: 'weekly', priority: '0.9' },
  { path: '/sql-prettify', name: 'sqlPrettify', changefreq: 'weekly', priority: '0.9' },
  { path: '/http-status-codes', name: 'httpStatusCodes', changefreq: 'weekly', priority: '0.9' },
  { path: '/chronometer', name: 'chronometer', changefreq: 'weekly', priority: '0.9' },
  { path: '/text-statistics', name: 'textStatistics', changefreq: 'weekly', priority: '0.9' },
  { path: '/iban-validator-and-parser', name: 'ibanValidatorAndParser', changefreq: 'weekly', priority: '0.9' },
  { path: '/lorem-ipsum-generator', name: 'loremIpsumGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/temperature-converter', name: 'temperatureConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/jwt-parser', name: 'jwtParser', changefreq: 'weekly', priority: '0.9' },
  { path: '/html-entities', name: 'htmlEntities', changefreq: 'weekly', priority: '0.9' },
  { path: '/bcrypt', name: 'bcrypt', changefreq: 'weekly', priority: '0.9' },
  { path: '/hash-text', name: 'hashText', changefreq: 'weekly', priority: '0.9' },
  { path: '/crontab-generator', name: 'crontabGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/chmod-calculator', name: 'chmodCalculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/emoji-picker', name: 'emojiPicker', changefreq: 'weekly', priority: '0.9' },
  { path: '/wifi-qr-code-generator', name: 'wifiQrCodeGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/random-port-generator', name: 'randomPortGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/roman-numeral-converter', name: 'romanNumeralConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/base-converter', name: 'baseConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/datetime-converter', name: 'dateTimeConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/otp-code-generator-and-validator', name: 'otpCodeGeneratorAndValidator', changefreq: 'weekly', priority: '0.9' },
  { path: '/mime-types', name: 'mimeTypes', changefreq: 'weekly', priority: '0.9' },
  { path: '/keycode-info', name: 'keycodeInfo', changefreq: 'weekly', priority: '0.9' },
  { path: '/slugify-string', name: 'slugifyString', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-minify', name: 'jsonMinify', changefreq: 'weekly', priority: '0.9' },
  { path: '/bip39-generator', name: 'bip39', changefreq: 'weekly', priority: '0.9' },
  { path: '/hmac-generator', name: 'hmacGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/rsa-key-pair-generator', name: 'rsaKeyPairGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/text-diff', name: 'textDiff', changefreq: 'weekly', priority: '0.9' },
  { path: '/string-obfuscator', name: 'stringObfuscator', changefreq: 'weekly', priority: '0.9' },
  { path: '/list-converter', name: 'listConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-diff', name: 'jsonDiff', changefreq: 'weekly', priority: '0.9' },
  { path: '/ipv4-range-expander', name: 'ipv4RangeExpander', changefreq: 'weekly', priority: '0.9' },
  { path: '/ipv6-ula-generator', name: 'ipv6UlaGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/ipv4-address-converter', name: 'ipv4AddressConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/benchmark-builder', name: 'benchmarkBuilder', changefreq: 'weekly', priority: '0.9' },
  { path: '/ipv4-subnet-calculator', name: 'ipv4SubnetCalculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/docker-run-to-docker-compose-converter', name: 'dockerRunToDockerComposeConverter', changefreq: 'weekly', priority: '0.9' },
  { path: '/html-wysiwyg-editor', name: 'htmlWysiwygEditor', changefreq: 'weekly', priority: '0.9' },
  { path: '/text-to-nato-alphabet', name: 'textToNatoAlphabet', changefreq: 'weekly', priority: '0.9' },
  { path: '/git-memo', name: 'gitMemo', changefreq: 'monthly', priority: '0.7' },
  { path: '/regex-memo', name: 'regexMemo', changefreq: 'monthly', priority: '0.7' },
  { path: '/email-normalizer', name: 'emailNormalizer', changefreq: 'weekly', priority: '0.9' },
  { path: '/xml-formatter', name: 'xmlFormatter', changefreq: 'weekly', priority: '0.9' },
  { path: '/yaml-viewer', name: 'yamlViewer', changefreq: 'weekly', priority: '0.9' },
  { path: '/yaml-to-json-converter', name: 'yamlToJson', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-to-yaml-converter', name: 'jsonToYaml', changefreq: 'weekly', priority: '0.9' },
  { path: '/toml-to-json', name: 'tomlToJson', changefreq: 'weekly', priority: '0.9' },
  { path: '/toml-to-yaml', name: 'tomlToYaml', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-to-toml', name: 'jsonToToml', changefreq: 'weekly', priority: '0.9' },
  { path: '/yaml-to-toml', name: 'yamlToToml', changefreq: 'weekly', priority: '0.9' },
  { path: '/json-to-csv', name: 'jsonToCsv', changefreq: 'weekly', priority: '0.9' },
  { path: '/camera-recorder', name: 'cameraRecorder', changefreq: 'weekly', priority: '0.9' },
  { path: '/phone-parser-and-formatter', name: 'phoneParserAndFormatter', changefreq: 'weekly', priority: '0.9' },
  { path: '/safelink-decoder', name: 'safelinkDecoder', changefreq: 'weekly', priority: '0.9' },
  { path: '/numeronym-generator', name: 'numeronymGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/mac-address-generator', name: 'macAddressGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/text-to-unicode', name: 'textToUnicode', changefreq: 'weekly', priority: '0.9' },
  { path: '/ulid-generator', name: 'ulidGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/user-agent-parser', name: 'userAgentParser', changefreq: 'weekly', priority: '0.9' },
  { path: '/pdf-signature-checker', name: 'pdfSignatureChecker', changefreq: 'weekly', priority: '0.9' },
  { path: '/token-generator', name: 'tokenGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/url-parser', name: 'urlParser', changefreq: 'weekly', priority: '0.9' },
  { path: '/mac-address-lookup', name: 'macAddressLookup', changefreq: 'weekly', priority: '0.9' },
  { path: '/svg-placeholder-generator', name: 'svgPlaceholderGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/math-evaluator', name: 'mathEvaluator', changefreq: 'weekly', priority: '0.9' },
  { path: '/eta-calculator', name: 'etaCalculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/percentage-calculator', name: 'percentageCalculator', changefreq: 'weekly', priority: '0.9' },
  { path: '/meta-tag-generator', name: 'metaTagGenerator', changefreq: 'weekly', priority: '0.9' },
  { path: '/ascii-text-drawer', name: 'asciiTextDrawer', changefreq: 'weekly', priority: '0.9' }
];

// Generate the sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

routes.forEach(route => {
  sitemap += `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
});

sitemap += '\n</urlset>';

// Write the sitemap to public directory in the project root
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

console.log('Sitemap generated successfully at', sitemapPath);