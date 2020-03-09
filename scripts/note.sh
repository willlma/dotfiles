#!/usr/bin/env bash

usage () {
  echo -e "\nUsage:\n$0 [arguments]"
  echo -e " \"The note text\" -t title"
  echo -e " -c: continue writing in Atom"
  exit;
}

if [ $# -eq 0 ]; then usage; fi

continue=false
text=$1
echo $text

while getopts ht: opt ${@:2}; do
  case $opt in
    h) usage;;
    d) continue=true;;
    t) title=$OPTARG;;
    * ) usage
  esac
done

now=$(date "+%Y%m%d_%H%M")
filename=~/Dropbox/Notes/"${now}_${title}.txt"
echo $text > $filename
echo $filename

if $continue; then atom $filename; fi
