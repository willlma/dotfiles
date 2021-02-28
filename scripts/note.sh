#!/usr/bin/env bash

#
#
#

usage () {
  echo -e "\nUsage:\n$0 [arguments]"
  echo -e " \"The note text\" -t title"
  echo -e " -c: continue writing in VS Code"
  exit;
}

if [ $# -eq 0 ]; then usage; fi

continue=false
text=$1
# echo $text

while getopts hct: opt ${@:2}; do
  case $opt in
    h) usage;;
    c) continue=true;;
    t) title=$OPTARG;;
    * ) usage
  esac
done

set_filename () {
  filename="$NOTES_DIRECTORY${now}_${title}.md"
}

if [ -z "$title" ]; then
  now=$(date "+%Y%m%d")
  filename="$NOTES_DIRECTORY${now}.md"
else
  now=$(date "+%Y%m%d_%H%M")
  filename="$NOTES_DIRECTORY${now}_${title}.md"
fi

echo $text >> $filename
echo $filename

if $continue; then
  code $NOTES_DIRECTORY $filename
fi

if command -v termux-open; then
  termux-open $filename
fi
