#!/usr/bin/env bash

usage () {
  echo -e "\nUsage:\n$0 [arguments]"
  echo -e " \"The note text\" -t [title]"
  echo -e " -c: continue writing in VS Code"
  exit 1
}

firefox=false
chrome=true

while getopts sfcht: opt; do
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
  osascript ./close-fh-tabs.scpt
fi

if [ -z "$time" ]; then
  time=1500
else
  time=$time*60
fi

sleep $time

open -a Signal
osascript -e 'tell application "System Events" to tell process "Signal" to set visible to false'
if $firefox; then
  open -a Firefox
  osascript -e 'tell application "System Events" to tell process "Firefox" to set visible to false'
fi
if $chrome; then
  osascript ./open-fh-tabs.scpt
fi
