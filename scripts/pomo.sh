killall Franz
# osascript -e 'quit app "Microsoft Outlook"'
if [ $# -eq 0 ]; then time=1500; else let time=$1*60; fi
sleep $time
open -a /Applications/Franz.app --hide
# open -g -a "Microsoft Outlook"
osascript -e 'tell application "System Events" to tell process "Franz" to set visible to false'
# osascript -e 'tell application "System Events" to tell process "Microsoft Outlook" to set visible to false'
