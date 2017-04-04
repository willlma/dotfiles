# copy this to ~/.bash_profile
# if [ -f ~/dotfiles/.bash_profile ]; then
#  source ~/dotfiles/.bash_profile
# fi

function zip-hibou() {
 zip extension web-app/all.min.js
 zip -r extension web-app/assets/
 zip -r extension web-app/html
 zip -r extension web-app/javascripts/lib/
 zip -r extension web-app/stylesheets/
 zip -r extension assets/
 zip -r extension data/
 zip -r extension lib/
 zip extension manifest.json
}

function zip-marq() {
 zip extension assets/icon-16.png
 zip extension assets/icon-48.png
 zip extension assets/icon-128.png
 zip -r extension content
 zip extension index.js
 zip extension manifest.json
}

HISTFILESIZE=1000
source ~/dotfiles/git-completion.bash
alias g="git"
__git_complete g __git_main
. ~/dotfiles/git-prompt.sh
export TERM="xterm-color"
# export PS1="\[\033[36m\]\u\[\033[m\]@\[\033[32m\]\h:\[\033[33;1m\]\w\[\033[m\]\$ "
GIT_PS1_SHOWDIRTYSTATE=true
# export PS1="\[\e[0;32m\]\w\[\e[0m\]\$(__git_ps1) "
export PS1="\[\e[0;32m\]\w\$(__git_ps1)\[\e[0m\] "
export CLICOLOR=1
export LSCOLORS=gxBxhxDxfxhxhxhxhxcxcx
export EDITOR=Atom
export ANDROID_HOME=~/Library/Android/sdk
export PATH=${PATH}:${ANDROID_HOME}/tools
la () {
  ls -GFha $1
}
if [ -f $(brew --prefix)/etc/bash_completion ]; then
  . $(brew --prefix)/etc/bash_completion
fi
alias hg="history | grep"

# ulimit -n 10000 #Need this for brunch otherwise we get a 'too many open files' error
# update_terminal_cwd is the default command
PROMPT_COMMAND='update_terminal_cwd ; if [ "$(id -u)" -ne 0 ]; then echo "$(date "+%Y-%m-%d.%H:%M:%S") $(pwd) $(history 1)" >> ~/Dropbox/config/logs/bash-history-$(date "+%Y-W%V").log; fi;'

lg () {
  time="*"
  if (( $# > 1 )); then
    time=$2
  fi
  grep -h $1 ~/Dropbox/config/logs/bash-history-$time
}

branchd () {
  branch=$(git rev-parse --abbrev-ref HEAD)
  git checkout develop
  git pull
  git branch -d $branch
}

cmp () {
  branch=$(git rev-parse --abbrev-ref HEAD)
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
}

pomo () {
  killall Franz
  if [ $# -eq 0 ]; then time=1500; else let time=$1*60; fi
  sleep $time
  open -g -a Franz
  osascript -e 'tell application "System Events" to tell process "Franz" to set visible to false'
}

# push () {
#   branch=$(git rev-parse --abbrev-ref HEAD)
#   if git rev-parse @{u}; then
#     message = $(git log --oneline -1 --pretty=%B)
#     git pull
#   git commit -am $branch
#   git push -u
# }
export PYTHONSTARTUP=~/dotfiles/.pythonrc
export PATH="/usr/local/sbin/:$PATH"
