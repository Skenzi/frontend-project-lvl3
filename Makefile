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

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

build:
	npm run build
