#!/bin/bash
set -xe

# Build GitBook
npm i -g gitbook-cli
(cd book; gitbook build)

# Deploy
rsync -avzhe "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
  --exclude '.git' --exclude 'node_modules' --exclude '.mysql' --delete --progress ./ \
  taller-docker@162.243.5.100:~/natura-poc.prod/

# Setup Docker services
ssh -o StrictHostKeyChecking=no taller-docker@162.243.5.100 \
    'cd /home/taller-docker/natura-poc.prod; make ci-deploy-continue'
