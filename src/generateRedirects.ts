import { readdirSync, statSync } from 'fs';

const pathRegex = /(?<=pages\/)(.*)(?=.tsx|jsx)/gm;

export type RedirectFormat = 'netlify.toml' | '_redirects' | 'json';

export const walk = function(dir: string) {
  let results: string[] = [];
  const list = readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
};

export const isDynamicPath = (path: string) => path.includes('[');

export const isTopLevelWildcard = (redirect: Redirect) => redirect.toPath.startsWith('/[...');

export const isWildcard = (redirect: Redirect) => redirect.toPath.includes('/[...');

type Redirect = {
  fromPath: string;
  fromPathParts: string[];
  toPath: string;
  toPathParts: string[];
  status: number;
};

export const generateRedirects = (path: string, format: RedirectFormat) => {
  const redirects: Redirect[] = [];

  walk(path).forEach((file) => {
    // If not a dynamic route, return as we don't want redirects for static routes.
    if (!isDynamicPath(file)) {
      return;
    }
    let pathsRegexRes;

    while ((pathsRegexRes = pathRegex.exec(file)) !== null) {
      const dynamicPage = pathsRegexRes[0];
      const results: string[] = [];

      // Process fromPath
      const replaceSquareBracketsWithColonRegex = /\[(.*?)\]/gm;

      let replaceSquareBracketsWithColonRegexRes;

      while (
        (replaceSquareBracketsWithColonRegexRes =
          replaceSquareBracketsWithColonRegex.exec(dynamicPage)) !== null
        ) {
        const result = replaceSquareBracketsWithColonRegexRes[0];
        if (result) {
          results.push(result);
        }
      }

      const fromPathParts: string[] = [];
      dynamicPage.split('/').forEach((p) => {
        if (p === 'index') {
          return;
        }
        const pathArgIndex = results.findIndex((res) => res === p);
        const pathArg = results[pathArgIndex];

        if (pathArg) {
          const pathArgStrippedOfBrackets = pathArg.replace(/(\[|\])/gm, '');
          if (pathArgStrippedOfBrackets.includes('...')) {
            // Wildcard route, replace with "*"
            p = '*';
          } else {
            p = `:${pathArgStrippedOfBrackets}`;
          }
        }
        fromPathParts.push(p);
      });
      const fromPath = '/' + fromPathParts.join('/');

      // Process toPath
      const toPathParts: string[] = [];
      dynamicPage.split('/').forEach((p) => {
        if (p === 'index') {
          return;
        }
        toPathParts.push(p);
      });
      const toPath = '/' + toPathParts.join('/') + '.html';

      redirects.push({
        fromPath,
        fromPathParts,
        toPath,
        toPathParts,
        status: 200,
      });
    }
  });

// Sorting redirects most specific to least specific.
  redirects.sort((a, b) => {
    if (isTopLevelWildcard(a) && !isTopLevelWildcard(b)) {
      return 1;
    }
    if (!isTopLevelWildcard(a) && isTopLevelWildcard(b)) {
      return -1;
    }
    if (isWildcard(a) && !isWildcard(b)) {
      return 1;
    }
    if (!isWildcard(a) && isWildcard(b)) {
      return -1;
    }
    if (a.toPathParts.length > b.toPathParts.length) {
      return -1;
    }
    if (a.toPathParts.length < b.toPathParts.length) {
      return 1;
    }
    const aToPathLastPart = a.toPathParts[a.toPathParts.length - 1];
    const bToPathLastPart = b.toPathParts[b.toPathParts.length - 1];

    if (isDynamicPath(aToPathLastPart) && !isDynamicPath(bToPathLastPart)) {
      return 1;
    }
    if (!isDynamicPath(aToPathLastPart) && isDynamicPath(bToPathLastPart)) {
      return -1;
    }
    return 0;
  });

  let result = '';

  if (format === '_redirects') {
    redirects.forEach(r => {
      result += `${r.fromPath} ${r.toPath} ${r.status}` + '\n';
    });
  } else if (format === 'json') {
    const res: Array<{ from: string, to: string, status: number }> = redirects.map(redirect => ({
      from: redirect.fromPath,
      to: redirect.toPath,
      status: redirect.status,
    }));
    result = JSON.stringify(res, null, '  ');
  } else {
    const res = redirects.map(r => {
      return `[[redirects]]
from = "${r.fromPath}"
to = "${r.toPath}"
status = ${r.status}
`;
    });
    result = res.join('\n');
  }

  return result;
};
