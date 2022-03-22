#!/usr/bin/env bash

usage () {
  echo -e "\nUsage:\n$0 [arguments]"
  echo -e " \"The note text\" -t [title]"
  echo -e " -c: continue writing in VS Code"
  exit 1
}

firefox=false
chrome=false
time=25
while getopts fcht: opt; do
  case $opt in
    h) usage;;
    f) firefox=true;;
    c) chrome=true;;
    t) time=$OPTARG;;
    * ) usage
  esac
done

killall Signal
if $firefox; then
  osascript -e 'quit app "Firefox"'
fi
if $chrome; then
  osascript ~/dotfiles/scripts/close-fh-tabs.scpt
fi

back_at=$(date -v+${time}M +"%H:%M")
echo -e "We'll be back online at $back_at\n"
time=$((time*60))
sleep $time

open -a Signal
osascript -e 'tell application "System Events" to tell process "Signal" to set visible to false'
if $firefox; then
  open -a "Firefox"
  osascript -e 'tell application "System Events" to tell process "Firefox" to set visible to false'
fi
if $chrome; then
  osascript ~/dotfiles/scripts/open-fh-tabs.scpt
fi
