# Makefile
install-dev: 
	npm install 

install: 
	npm ci

publish:
	npm publish --dry-run

lint:
	npx eslint .

fix:
	npx eslint . --fix

build:
	rm -rf dist
	NODE_ENV=production npx webpack
