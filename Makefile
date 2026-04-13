.PHONY: install dev build deploy lint clean

install:
	cd web && npm install

dev:
	cd web && npm run dev

build:
	cd web && npm run build

deploy:
	cd web && vercel --prod

lint:
	cd web && npm run lint

clean:
	rm -rf web/.next web/node_modules
