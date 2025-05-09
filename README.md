# disti

Create a package for distribution to a server. It will include the specified "include" files, exclude any "exclude" files using fast-glob patterns, and adds the required node_modules (mimicking --production) into the the distribution. Your choice of either or both an archive (tgz or zip) or directory output.


### Running
```
disti --config "my-app-config.yml"
```

### Config
```
# disti
# paths can be absolute or relative to workingDir
workingDir: "" # project folder to base the dist on (defaults to process.cwd)
rootDir: "" # root of where to find node_modules (defaults to workingDir). Useful for monorepos

# globs of files to include
include: []

# globs of files to exclude from the dist
# "**/node_modules/**/*" is automatically added to this, since the dependency inspection should find all the necessary node_modules
exclude: []

### OUTPUT
distDir: "" # directory you would like the dist to be placed into
distArchive: "" # archive you would like the dist to be placed into
```
