branch=$(git rev-parse --abbrev-ref HEAD)
if git rev-parse @{u}; then
  message = $(git log --oneline -1 --pretty=%B)
  git pull
git commit -am $branch
git push -u
