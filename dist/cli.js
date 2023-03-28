#!/usr/bin/env node
import {runCli} from './index.js';

runCli()
    .then(returnCode => {
        process.exit(returnCode);
    })
    .catch(error => {
        console.error(error);
    });
