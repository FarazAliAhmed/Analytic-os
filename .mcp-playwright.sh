#!/bin/bash
# Wrapper script for playwright MCP server with Node 20

cd /Users/apple/Project/analyti-web3/analyti-web3

# Load nvm and use Node 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Run the playwright MCP server
exec npx -y @executeautomation/playwright-mcp-server "$@"
