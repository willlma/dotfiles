#!/usr/bin/env bash
if [ "$(id -u)" -ne 0 ]; then
  echo $(date "+%Y-%m-%d.%H:%M:%S") $(pwd) $(history 1) >> ~/Dropbox/config/logs/bash-history-$(date "+%Y-W%V").log
fi
