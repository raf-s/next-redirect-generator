import { resolve } from 'path';
import { writeFileSync } from 'fs';
import { generateRedirects, RedirectFormat } from './generateRedirects';

type RunCliArgs = {
  cwd?: string;
  format?: RedirectFormat;
  path?: string;
  output?: string;
};

export function runCli(args: RunCliArgs) {
  if (!args.cwd) {
    throw new Error('args.cwd is undefined');
  }
  const pagesFolder = resolve(args.cwd, args.path || 'pages');
  const format = args.format || '_redirects';
  const redirects = generateRedirects(pagesFolder, format);

  console.log(
    `[ Generating redirects from: ${pagesFolder} to ${
      args.output || 'console'
    } ]`,
    `format: ${format}`,
  );
  if (redirects.length === 0) {
    console.warn('No dynamic routes found.');
    return;
  }

  if (args.output) {
    writeFileSync(args.output, redirects);
  } else {
    process.stdout.write(redirects);
  }
}
