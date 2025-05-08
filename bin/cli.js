#!/usr/bin/env node

"use strict";

const mri = require("mri");
const { readConfig, prepareConfig } = require("../src/config");
const { doDisti } = require("../src/disti");

async function cli() {
  try {
    // saving for later when we use a config file
    const argv = process.argv.slice(2);

    let args = mri(argv, {
        string: ["config"],
    });
    let config = {}
    if (args.config) config = readConfig(args.config);
    config = prepareConfig(config);

    await doDisti(config);

    // TODO add logging and logging level
    // TODO add help
    console.log("Success");
  } catch (err) {
    console.log(err);
    throw err;
  }
}

cli().catch((err) => {
  process.exit(1);
});
