#!/usr/bin/env node
import {runCli} from "./index.js";
import yargs from "yargs/yargs";

const cwd = process.cwd();

const argv = yargs(process.argv.slice(2)).options({
  format: {alias: "f", choices: ["netlify.toml", "_redirects"],},
  path: {alias: "p", string: true,},
}).parseSync();

(async () => {
  runCli({
    cwd, format: argv.format, path: argv.path,
  })
    .then(returnCode => {
      process.exit(returnCode);
    })
    .catch(error => {
      console.error(error);
    });
})();
