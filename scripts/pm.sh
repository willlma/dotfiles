#!/usr/bin/env bash

branch=$(git rev-parse --abbrev-ref HEAD)
if [[ $branch == "master" ]]; then
  git pull
else
  git fetch origin master:master
  git rebase master
fi
