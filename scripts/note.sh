#!/usr/bin/env bash

usage () {
  echo -e "\nUsage:\n$0 [arguments]"
  echo -e " \"The note text\" -t [title]"
  echo -e " -c: continue writing in VS Code"
  exit 1
}

set_filename () {
  now=$(date "+%Y%m%d")
  filename="$NOTES_DIRECTORY${now}.md"
}

if [ $# -eq 0 ]; then
  if command -v termux-open; then
    set_filename
    echo "$filename"
    echo "- [ ] " >> "$filename"
    am start --user 0 -n net.ia.iawriter.x/net.ia.iawriter.x.filelist.FileListActivity
    exit 0
  fi
  usage
fi

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

if [ -z "$title" ]; then
  set_filename
else
  now=$(date "+%Y%m%d_%H%M")
  filename="$NOTES_DIRECTORY${now}_${title}.md"
fi

echo $text >> "$filename"
echo $filename

if $continue; then
  code $NOTES_DIRECTORY $filename
fi
