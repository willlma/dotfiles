ln -s ~/dotfiles/.gitconfig ~
chmod -R u+x ~/dotfiles/scripts/
echo "if [ -f ~/dotfiles/.zshrc ]; then source ~/dotfiles/.zshrc; fi" >> ~/.zshrc

# Ruby
# ln -s ~/dotfiles/.inputrc ~
# ln -s ~/dotfiles/.irbrc ~
# ln -s ~/dotfiles/.aprc ~
