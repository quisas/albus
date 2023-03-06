#!/usr/bin/env node

/**
 * Based on:
 * Marked CLI
 * Copyright (c) 2011-2013, Christopher Jeffrey (MIT License)
 */

import { promises } from 'fs';
import marked from '../web_root/files/js/libs/marked/marked.js';

const { readFile, writeFile } = promises;


/**
 * Main
 */

async function main(argv) {
  const options = {};
  let input;

	argv.shift();
	argv.shift();
  input = argv.shift();

  const data = await readFile(input, 'utf8');
	
  const html = marked(data, options);

  process.stdout.write(html + '\n');
}


/**
 * Expose / Entry Point
 */

process.title = 'marked';
main(process.argv.slice()).then(code => {
  process.exit(code || 0);
})

// 	.catch(err => {
//   process.exit(1)
// });
