#!/bin/bash

BUCKET="tools.monday.health"

npm run build
cd build

echo ""
echo "Uploading build..."
aws s3 sync . s3://${BUCKET} --delete \
    --acl public-read \
    --exclude service-worker.js

echo "Uploading service-worker.js"
aws s3 cp ./service-worker.js s3://${BUCKET}/service-worker.js \
    --acl public-read \
    --metadata-directive REPLACE \
    --cache-control max-age=0,no-cache,no-store,must-revalidate

echo "Done"
