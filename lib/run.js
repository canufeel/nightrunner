'use strict';

const cp = require('child_process');
const path = require('path');
const install = require('./install.js');

const run = (args) => {
  args = args || {};

  install((drivers) => {
    if (args.download) {
      return;
    }

    const opts = {
      cwd: path.resolve(__dirname, '..'),
      env: Object.assign({
        NR_TESTS_PATH: args.tests ? path.resolve(process.cwd(), args.tests) : '',
        NR_PAGES_PATH: args.pages ? path.resolve(process.cwd(), args.pages) : '',
        NR_GLOBALS_PATH: args.globals ? path.resolve(process.cwd(), args.globals) : '',
        NR_COMMANDS_PATH: args.commands ? path.resolve(process.cwd(), args.commands) : '',
        NR_ASSERTIONS_PATH: args.assertions ? path.resolve(process.cwd(), args.assertions) : '',
        NR_OUTPUT_PATH: args.output ? path.resolve(process.cwd(), args.output) : '',
        NR_SCREENSHOTS_PATH: args.screenshots ? path.resolve(process.cwd(), args.screenshots) : '',
      }, process.env),
      stdio: 'inherit',
    };

    const nodeArgs = [
      require.resolve('nightwatch/bin/runner.js'),
    ];

    if (args.verbose) {
      nodeArgs.push('--verbose');
    }

    if (args.browser) {
      nodeArgs.push('--env', args.browser);
    }

    if (args.test) {
      nodeArgs.push('--test', path.resolve(process.cwd(), args.test));
    }

    if (args.case) {
      nodeArgs.push('--testcase', args.case);
    }

    const proc = cp.spawn('node', nodeArgs, opts);
    proc.on('close', (code) => {
      if (code !== 0) {
        throw new Error('nightwatch exited with code: ' + code);
      }
    });
    proc.on('error', (error) => {
      throw error;
    });
  });
};

module.exports = run;
