import path from 'path';
import * as fs from 'fs';
import { generateRedirects } from 'nextjs-to-netlify-redirect-exporter';

const outDir = path.join(process.cwd(), 'out');

const pagesFolder = path.join(process.cwd(), 'pages');
const redirects = generateRedirects(pagesFolder, '_redirects');
fs.writeFileSync(path.join(outDir, '_redirects'), redirects);
