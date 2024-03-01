import path from 'path';
import * as fs from 'fs';
import { generateRedirects } from 'next-redirect-generator';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'path';

// Redirects
const pagesFolder = join(process.cwd(), 'pages');

// Generated redirects in chosen format.
const redirects = generateRedirects(pagesFolder, '_redirects');

// Only add file if something has been generated.
if(redirects.trim()) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const dest = join(__dirname, '../out/_redirects');

  fs.writeFileSync(dest, redirects)
  console.log('Wrote', dest);
}

