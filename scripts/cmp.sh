branch=$(git rev-parse --abbrev-ref HEAD)
git pull
if [[ $branch == "develop" || $branch == "master" ]]; then
  read -p "You're on $branch branch. Sure you want to do this?" -n 1 -r
  echo    # (optional) move to a new line
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      # handle exits from shell or function but don't exit interactive shell
      [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
  fi
fi
if [ $# -eq 0 ]; then message=$branch; else message=$1; fi
git commit -am "$message"
git push -u
