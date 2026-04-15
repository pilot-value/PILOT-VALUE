import fs from 'fs';
import path from 'path';
import { glob } from 'fs';
import { promisify } from 'util';

const MEASUREMENT_ID = 'G-3XYF69VQ3X';

const GA_SNIPPET = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${MEASUREMENT_ID}');
</script>`;

// Collect all HTML files
const dirs = [
  '.',
  './airlines',
  './en/airlines',
];

let files = [];
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (entry.endsWith('.html')) {
      files.push(path.join(dir, entry));
    }
  }
}

let updated = 0;
let skipped = 0;
let alreadyHas = 0;

for (const fp of files) {
  let html = fs.readFileSync(fp, 'utf8');

  // Skip if already has GA tag
  if (html.includes('googletagmanager.com/gtag') || html.includes(MEASUREMENT_ID)) {
    alreadyHas++;
    continue;
  }

  // Insert before </head>
  if (!html.includes('</head>')) {
    skipped++;
    continue;
  }

  html = html.replace('</head>', `${GA_SNIPPET}\n</head>`);
  fs.writeFileSync(fp, html, 'utf8');
  updated++;
}

console.log(`\n=== GA4挿入完了 ===`);
console.log(`✓ 挿入: ${updated}ページ`);
console.log(`— 既存: ${alreadyHas}ページ（スキップ）`);
console.log(`— </head>なし: ${skipped}ページ（スキップ）`);
console.log(`\nMeasurement ID: ${MEASUREMENT_ID}`);
