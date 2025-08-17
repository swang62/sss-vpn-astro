#!/bin/bash

# echo "Applying any new migrations first"
pnpm drizzle-kit migrate

node ./dist/server/entry.mjs
