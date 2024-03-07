prepare:
	docker-compose up -d --build

up:
	docker-compose up -d

build:
	docker-compose build

down:
	docker-compose down

run:
	docker-compose exec app npm run start:dev

migrate:
	docker-compose exec app npx prisma migrate dev

studio:
	docker-compose exec app npx prisma studio

lint:
	docker-compose exec app npm run lint

seed:
	docker-compose exec app npx prisma db seed

