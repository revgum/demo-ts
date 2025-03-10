#!/bin/zsh

# Install podman
apt update && apt install -y podman

# Install latest Node
source $NVM_DIR/nvm.sh && nvm install --lts

# Install global biomejs package
npm install -g @biomejs/biome

# Install Pyenv
curl -fsSL https://pyenv.run | bash
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init - zsh)"' >> ~/.zshrc
echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.zshrc

# Init the shell again to automate pyenv steps
source ~/.zshrc

# Install Python 3.12 into venv
pyenv install 3.12
pyenv global 3.12
pyenv virtualenv 3.12 python-venv
pyenv activate python-venv
echo 'pyenv activate python-venv' >> ~/.zshrc

# Upgrade to the latest pip
python -m pip install --upgrade pip

# Install podman-compose
pip install podman-compose
