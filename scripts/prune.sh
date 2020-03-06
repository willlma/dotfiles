echo "git remote prune origin"
git remote prune origin
echo "git branch -vv | grep '[origin/.*: gone]' | awk '{print $1}' | xargs git branch -d"
git branch -vv | grep '[origin/.*: gone]' | awk '{print $1}' | xargs git branch -d
