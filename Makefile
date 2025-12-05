.PHONY: setup
setup: setup-highlightjs npm_install

node_modules/:
	npm ci

.PHONY: npm_install
npm_install: node_modules/

.PHONY: format
format: setup
	pkl format -w .
	hawkeye format
	node_modules/.bin/prettier -w .

.PHONY: lint
lint: setup
	pkl format --diff-name-only .
	hawkeye check
	node_modules/.bin/prettier --check .
	node_modules/.bin/eslint .

.PHONY: lint-js
lint-js:
	node_modules/.bin/prettier --check .
	node_modules/.bin/eslint .

.PHONY: setup-highlightjs
setup-highlightjs: build/highlight.js

build/highlight.js:
	git clone --depth 1 --branch 11.11.1 https://github.com/highlightjs/highlight.js.git build/highlight.js
	cd build/highlight.js && npm ci
	cd build/highlight.js/extra && ln -s ../../.. highlightjs-pkl

dist/pkl.es.min.js dist/pkl.min.js: setup
	cd build/highlight.js && node tools/build.js -t cdn -n pkl
	hawkeye format --fail-if-updated=false

build: dist/pkl.es.min.js dist/pkl.min.js
