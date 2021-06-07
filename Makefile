# Makefile
install-dev: 
	npm install 

install: 
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint src/

fix:
	npx eslint src/ --fix

build:
	NODE_ENV=production npx webpack
