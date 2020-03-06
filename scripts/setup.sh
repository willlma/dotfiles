ln -s ~/dotfiles/.gitconfig ~
ln -s ~/dotfiles/.inputrc ~
ln -s ~/dotfiles/.irbrc ~
ln -s ~/dotfiles/.aprc ~
ln -s /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl /usr/local/bin/subl
echo "if [ -f ~/dotfiles/.bash_profile ]; then source ~/dotfiles/.bash_profile; fi" >> ~/.bash_profile
