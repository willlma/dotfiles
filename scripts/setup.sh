ln -s ~/dotfiles/.gitconfig ~
chmod -R u+x ~/dotfiles/scripts/
echo "if [ -f ~/dotfiles/.zprofile ]; then source ~/dotfiles/.zprofile; fi" >> ~/.zprofile

# Ruby
# ln -s ~/dotfiles/.inputrc ~
# ln -s ~/dotfiles/.irbrc ~
# ln -s ~/dotfiles/.aprc ~
