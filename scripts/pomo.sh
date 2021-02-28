osascript -e 'quit app "Firefox"'
killall Signal
killall Slack
if [ $# -eq 0 ]; then time=1500; else let time=$1*60; fi
sleep $time
open -a Firefox
open -a Signal
open -a Slack
osascript -e 'tell application "System Events" to tell process "Firefox" to set visible to false'
osascript -e 'tell application "System Events" to tell process "Signal" to set visible to false'
sleep 2
osascript -e 'tell application "System Events" to tell process "Slack" to set visible to false'
