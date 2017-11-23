#!/bin/bash

rsync -avzhe "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" \
  --exclude '.git' --exclude 'node_modules' --delete --progress ./ \
  taller-docker@162.243.5.100:~/natura-poc.prod/