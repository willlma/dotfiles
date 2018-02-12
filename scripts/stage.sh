BRANCH=$1
REPO_ROOT="/Users/wmarquardt/toutapp/"
REPOS="ui-components tout-languages tout-table tout-burning-man"

if [ -z "${BRANCH-}" ]
then
  echo "🙈 Branch argument required to stage."
  exit 125
fi

for REPO in $REPOS
do
  cd "$REPO_ROOT/$REPO" && git fetch && git checkout $BRANCH && git pull origin $BRANCH
done
