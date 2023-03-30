#!/usr/bin/env node
import {runCli} from './index.js';

const cwd = process.cwd();

runCli(cwd)
    .then(returnCode => {
        process.exit(returnCode);
    })
    .catch(error => {
        console.error(error);
    });
