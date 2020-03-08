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
# export LSCOLORS=gxBxhxDxfxhxhxhxhxcxcx
export LSCOLORS=Gxheahdhfxegedabagacad
# export EDITOR=Atom
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
la () {
  ls -GFha $1
}

if [ -f $(brew --prefix)/etc/bash_completion ]; then
  . $(brew --prefix)/etc/bash_completion
fi

# update_terminal_cwd is the default command
PROMPT_COMMAND="$PROMPT_COMMAND; if [ "$(id -u)" -ne 0 ]; then echo "$(date "+%Y-%m-%d.%H:%M:%S") $(pwd) $(history 1)" >> ~/Dropbox/config/logs/bash-history-$(date "+%Y-W%V").log; fi;"

export PYTHONSTARTUP=~/dotfiles/.pythonrc
export PATH="/usr/local/opt/python/libexec/bin:$PATH"

chmod -R u+x ~/dotfiles/scripts/
alias branchd="~/dotfiles/scripts/branchd.sh"
alias cmp="~/dotfiles/scripts/cmp.sh"
alias lg="~/dotfiles/scripts/lg.sh"
alias pomo="~/dotfiles/scripts/pomo.sh"
alias prod_dump="~/dotfiles/scripts/prod_dump.sh"
alias stage="~/dotfiles/scripts/stage.sh"
alias hg="history | grep"
alias prune="~/dotfiles/scripts/prune.sh"

HEROKU_AC_BASH_SETUP_PATH=~/Library/Caches/heroku/autocomplete/bash_setup && test -f $HEROKU_AC_BASH_SETUP_PATH && source $HEROKU_AC_BASH_SETUP_PATH;
