branch=$(git rev-parse --abbrev-ref HEAD)
git checkout master
git pull
git branch -D $branch
