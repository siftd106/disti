"use strict";
const { execSync } = require("node:child_process");
const path = require("path");
const fs = require("fs-extra");
const archiver = require("archiver");

function buildDist(distDir, workingDir, rootDir, deps, files) {
  for (let i = 0; i < deps.length; i++) {
    let from = path.join(rootDir, deps[i]);
    let to = path.join(distDir, deps[i]);
    if (!deps[i].includes("/.bin/")) {
      // do not copy bin links - they will get rebuilt with "npm rebuild" later
      // console.log(`Copy: ${from} : ${to}`);
      fs.copySync(from, to, { dereference: true });
    }
  }
  for (let i = 0; i < files.length; i++) {
    let from = path.join(workingDir, files[i]);
    let to = path.join(distDir, files[i]);
    // console.log(`Copy: ${from} : ${to}`);
    let deref = !files[i].includes("/.bin/");
    fs.copySync(from, to, { dereference: deref });
  }

  execSync("npm rebuild", { cwd: distDir });

  return;
}

function doDistDir(distInternal, distDir) {
  fs.ensureDirSync(distDir);
  fs.copySync(distInternal, distDir, { dereference: false });
};

function doDistArchive(distInternal, distArchive) {
  let archiveType, archiveOptions;
  if (distArchive.endsWith('.tar')) {
    archiveType = "tar";
    archiveOptions = {};
  } else if (distArchive.endsWith('.tar.gz') || distArchive.endsWith('.tgz')) {
    archiveType = "tar";
    archiveOptions = {
      gzip: true,
      gzipOptions: {
        level: 1,
      },
    };
  } else if (distArchive.endsWith('.zip')) {
    archiveType = "zip";
    archiveOptions = {
      zlib: { level: 9 }, // Sets the compression level.
    };
  } else {
    throw new Error("Unkown archive type");
  }

  let stream = fs.createWriteStream(distArchive);
  let archive = archiver(archiveType, archiveOptions);
  return new Promise((resolve, reject) => {
    stream.on("close", resolve);
    stream.on("error", reject);
    archive.on("error", reject);

    stream.on("open", () => {
      archive.pipe(stream);
      archive.directory(distInternal, false);
      archive.finalize();
    });
  });
};

module.exports = {
  buildDist,
  doDistDir,
  doDistArchive,
};
