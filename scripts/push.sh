branch=$(git rev-parse --abbrev-ref HEAD)
if [ $# -eq 0 ]; then
  message=$branch
elif [[ $branch == "main" || $branch == "master" ]]; then
  message=$1
else
  message="$branch: $1"
fi

git commit -am "$message"
git push
