branch=$(git rev-parse --abbrev-ref HEAD)
git checkout develop
git pull
git branch -d $branch
