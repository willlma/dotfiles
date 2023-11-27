alias g="git"
: 'Removing terminal colors while I test Warp
export TERM="xterm-color"
GIT_PS1_SHOWDIRTYSTATE=true
export PS1="\[\e[0;32m\]\w\$(__git_ps1)\[\e[0m\] "
export CLICOLOR=1
export LSCOLORS=Gxheahdhfxegedabagacad
'
export EDITOR="code -w"
: 'Removing Android stuff
export ANDROID_HOME=~/Library/Android/sdk
export PATH=$ANDROID_HOME/tools:$PATH
export PATH=$ANDROID_HOME/platform-tools:$PATH
'
la () {
  ls -GFha $1
}

eval "$(/opt/homebrew/bin/brew shellenv)"
[[ -r "$(brew --prefix)/etc/profile.d/bash_completion.sh" ]] && . "$(brew --prefix)/etc/profile.d/bash_completion.sh"

export NOTES_DIRECTORY=~/Dropbox/Notes/

# update_terminal_cwd is the default command
# PROMPT_COMMAND="update_terminal_cwd; source ~/dotfiles/scripts/log_history.sh"

# export PYTHONSTARTUP=~/dotfiles/.pythonrc
# export PATH="/usr/local/opt/python/libexec/bin:$PATH"
export PATH="/Applications/Visual Studio Code.app/Contents/Resources/app/bin:$PATH"
export PATH="$HOME/.deno/bin:$PATH"
# export LC_ALL=en_US.UTF-8

chmod -R u+x ~/dotfiles/scripts/
alias branchd="~/dotfiles/scripts/branchd.sh"
alias pm="~/dotfiles/scripts/pm.sh"
alias grc="GIT_EDITOR=true git rebase --continue"
alias cmp="~/dotfiles/scripts/cmp.sh"
alias push="~/dotfiles/scripts/push.sh"
alias note="~/dotfiles/scripts/note.py"
alias notes="code ~/Dropbox/Notes/"
alias lg="~/dotfiles/scripts/lg.sh"
alias pomo="~/dotfiles/scripts/pomo.sh"
alias prod_dump="~/dotfiles/scripts/prod_dump.sh"
alias stage="~/dotfiles/scripts/stage.sh"
alias hg="history | grep"
alias prune="~/dotfiles/scripts/prune.sh"
