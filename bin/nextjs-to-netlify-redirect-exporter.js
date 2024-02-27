#!/usr/bin/env node
import {runCli} from "../dist/index";
import yargs from "yargs/yargs";

const cwd = process.cwd();

const argv = yargs(process.argv.slice(2)).options({
  format: {alias: "f", choices: ["netlify.toml", "_redirects", "json"],},
  path: {alias: "p", string: true,},
  out: {alias: "o", string: true},
}).parseSync();

(async () => {
  runCli({
    cwd, format: argv.format, path: argv.path, output: argv.out,
  })
    .then(returnCode => {
      process.exit(returnCode);
    })
    .catch(error => {
      console.error(error);
    });
})();
