import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export async function runCli() {
  const walk = function (dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
      file = dir + '/' + file;
      const stat = fs.statSync(file);
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

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const pagesFolder = path.join(__dirname, '../pages');
  const pathRegex = /(?<=pages\/)(.*)(?=.tsx)/gm;

  type Redirect = {
    fromPath: string;
    toPath: string;
    status: number;
  };

  const redirects: Redirect[] = [];

  walk(pagesFolder).forEach((f) => {
    // If not a dynamic route.
    if (!f.includes('[')) {
      return;
    }
    let pathsRegexRes;

    while ((pathsRegexRes = pathRegex.exec(f)) !== null) {
      let dynamicPage = pathsRegexRes[0];
      let results = [];

      // Process fromPath
      const replaceSquareBracketsWithColonRegex = /\[(.*?)\]/gm;
      let replaceSquareBracketsWithColonRegexRes;
      while (
        (replaceSquareBracketsWithColonRegexRes =
          replaceSquareBracketsWithColonRegex.exec(dynamicPage)) !== null
        ) {
        let result = replaceSquareBracketsWithColonRegexRes[0];
        if (result) {
          results.push(result);
        }
      }

      const fromPathParts = [];
      dynamicPage.split('/').forEach((p) => {
        if (p === 'index') {
          return;
        }
        const pathArgIndex = results.findIndex((res) => res === p);
        const pathArg = results[pathArgIndex];

        if (pathArg) {
          const pathArgStrippedOfBrackets = pathArg.replace(/(\[|\])/gm, '');
          if(pathArgStrippedOfBrackets.includes("...")) {
            // Wildcard route, replace with "*"
            p = "*";
          } else {
            p = `:${pathArgStrippedOfBrackets}`;
          }
        }
        fromPathParts.push(p);
      });
      const fromPath = '/' + fromPathParts.join('/');

      // Process toPath
      const toPathParts = [];
      dynamicPage.split('/').forEach((p) => {
        if (p === 'index') {
          return;
        }
        toPathParts.push(p);
      });
      const toPath = '/' + toPathParts.join('/') + '.html';

      redirects.push({
        fromPath,
        toPath,
        status: 200,
      });
    }
  });

// console.log(`
// [[redirects]]
//   from = "${fromPath}"
//   to = "${toPath}"
//   status = 200
//     `)

// @todo: Now we have to sort our wildcards
  console.log({ redirects });
}
