# brew
eval "$(/opt/homebrew/bin/brew shellenv)"
if type brew &>/dev/null
then
  FPATH="$(brew --prefix)/share/zsh/site-functions:${FPATH}"

  autoload -Uz compinit
  compinit
fi

# deno
export PATH="$HOME/.deno/bin:$PATH"

# git
alias g="git"
. ~/dotfiles/git-prompt.sh
zstyle ':completion:*:*:git:*' script ~/dotfiles/.git-completion.zsh
GIT_PS1_SHOWDIRTYSTATE=true
setopt PROMPT_SUBST
export PROMPT="%F{green}%~%f\$(__git_ps1) "
export CLICOLOR=1
export LSCOLORS=Gxheahdhfxegedabagacad

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Node

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Android

export PATH="$HOME/Library/Android/sdk/platform-tools:$PATH"

# PG

export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"

# ESP-32

alias get_esprs='. $HOME/export-esp.sh'
export PATH="/Applications/CMake.app/Contents/bin":"$PATH"

# Added by LM Studio CLI (lms)
export PATH="$PATH:/Users/willlma/.lmstudio/bin"

# Aliases

la () {
  ls -GFha $1
}

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
