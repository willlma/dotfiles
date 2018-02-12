time="*"
if (( $# > 1 )); then
  time=$2
fi
grep -h $1 ~/Dropbox/config/logs/bash-history-$time
