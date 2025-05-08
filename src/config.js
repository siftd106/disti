"use strict";

const fs = require("fs-extra");
const path = require("path");
const { parseDocument } = require('yaml');

function readConfig(configFile) {
  try {
    return parseDocument(fs.readFileSync(configFile, 'utf8')).toJS();
  } catch (err) {
    throw err;
  }
};

function prepareConfig(config = {}) {
  let newConfig = {}
  // build the config based on defaults and the config that is passed in
  newConfig["workingDir"] = config["workingDir"] || process.cwd();
  let basePath
  if (path.isAbsolute(newConfig["workingDir"])) {
    basePath = newConfig["workingDir"];
  } else {
    basePath = process.cwd();
  }
  newConfig["rootDir"] = config["rootDir"] || newConfig["workingDir"];
  newConfig["distInternal"] = path.join(newConfig["workingDir"], "_dist");
  if (config["distDir"]) newConfig["distDir"] = config["distDir"];
  if (config["distArchive"]) newConfig["distArchive"] = config["distArchive"];

  newConfig = resolvePaths(newConfig, basePath);

  newConfig["include"] = config["include"] || ["**/*"];
  newConfig["exclude"] = config["exclude"] || [];
  newConfig["exclude"].push("**/node_modules/**/*"); // exclude node_modules, since they should be correctly included from the dependency inspection

  // error if  distDir, distArchive or distInternal already exists
  if (fs.existsSync(newConfig["distDir"])) throw new Error(`${ newConfig["distDir"]} already exists.`);
  if (fs.existsSync(newConfig["distArchive"])) throw new Error(`${ newConfig["distArchive"]} already exists.`);
  if (fs.existsSync(newConfig["distInternal"])) throw new Error(`${ newConfig["distInternal"]} already exists.`);

  return newConfig;
}

function resolvePaths(paths = {}, basePath){
  for (const p in paths) {
    if (!path.isAbsolute(paths[p])) {
      paths[p] = path.resolve(basePath, paths[p]);
    }
  }
  return paths;
}

module.exports = {
  readConfig,
  prepareConfig,
};
