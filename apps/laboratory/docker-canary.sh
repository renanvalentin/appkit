#!/usr/env/bin

# Not adding `set -e` so that S3 upload happens regardless

npm run playwright:canary:test

destination="s3://$TEST_RESULTS_BUCKET/web3modal-canary/$(date --iso-8601=seconds)/test-results/"
echo "Uploading test results to $destination"
aws s3 cp ./test-results/ $destination --recursive