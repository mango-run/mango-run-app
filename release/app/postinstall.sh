#!/bin/bash

# workaround: resolve macos build issue
(cd node_modules/bufferutil && npm install && npm run prebuild)
(cd node_modules/utf-8-validate && npm install && npm run prebuild)

npm run electron-rebuild && npm run link-modules