#!/bin/bash
set -e

DB_PATH=./data/$DB_FILENAME
rm -r $DB_PATH

echo "Restoring $DB_PATH from $NODE_ENV replica"

litestream restore -config ./build/litestream.yml -if-replica-exists $DB_PATH 

echo "Success!"