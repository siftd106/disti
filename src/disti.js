"use strict";

const fs = require("fs-extra");
const fg = require("fast-glob");
const { findProdInstalls } = require("inspectdep");
const { buildDist, doDistDir, doDistArchive } = require("./utility");

async function doDisti({ workingDir, rootDir, include = [], exclude = [], distDir, distArchive, distInternal }) {
  try {
    // figure out what deps and files to include in the dist
    console.log("Finding dependencies");
    const deps = await findProdInstalls({ rootPath: rootDir, curPath: workingDir });
    console.log("Finding all additional files to include");
    const files = await fg(include, { dot: true, ignore: exclude });

    // build the internalDist
    console.log("Building the dist");
    buildDist(distInternal, workingDir, rootDir, deps, files);

    // create the folder and/or archives
    if (distDir) {
      console.log(`Creating the dist directory: ${distDir}`);
      doDistDir(distInternal, distDir);
    }
    if (distArchive) {
      console.log(`Creating the dist archive: ${distArchive}`);
      await doDistArchive(distInternal, distArchive);
    }
  } catch (err) {
    throw err;
  } finally {
    if (fs.existsSync(distInternal)) {
      console.log("Cleaning up temporary dist");
      fs.removeSync(distInternal);
    }
  }

  return;
}


module.exports = {
  doDisti,
};
