killall Slack
osascript -e 'quit app "Firefox"'
if [ $# -eq 0 ]; then time=1500; else let time=$1*60; fi
sleep $time
open -a Slack
open -a Firefox --hide
osascript -e 'tell application "System Events" to tell process "Firefox" to set visible to false'
sleep 3
osascript -e 'tell application "System Events" to tell process "Slack" to set visible to false'
