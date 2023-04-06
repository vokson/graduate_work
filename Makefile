up:
	docker compose --env-file .env.prod up -d --build
createsuperuser:
	docker compose --env-file .env.prod exec flask flask -A src.app:app users createsuperuser
migrate:
	docker compose exec --workdir /opt/app/src flask alembic upgrade head

uvicorn src.entrypoints.main:app --reload --host 0.0.0.0 --port 8001 --forwarded-allow-ips '*'
