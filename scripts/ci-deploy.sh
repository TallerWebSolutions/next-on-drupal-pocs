#!/bin/bash

# Build GitBook
npm i -g gitbook-cli
gitbook build

# Deploy
rsync -avzhe "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
  --exclude '.git' --exclude 'node_modules' --delete --progress ./ \
  taller-docker@162.243.5.100:~/natura-poc.prod/

# Setup Docker services
ssh -o StrictHostKeyChecking=no taller-docker@162.243.5.100 \
    'cd /home/taller-docker/natura-poc.prod; docker-compose -f docker-compose.prod.yml up -d'