ln -s ~/dotfiles/.gitconfig ~
# ln -s ~/dotfiles/.inputrc ~
ln -s ~/dotfiles/.irbrc ~
ln -s ~/dotfiles/.aprc ~
echo "if [ -f ~/dotfiles/.zprofile ]; then source ~/dotfiles/.zprofile; fi" >> ~/.zprofile
