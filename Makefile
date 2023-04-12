up:
	docker compose up -d --build
migrate:
	docker compose exec --workdir /opt/app/src/migrations auth python migrate.py && \
	docker compose exec --workdir /opt/app/src/migrations storage python migrate.py
pollute:
	docker compose exec --workdir /opt/app/src/migrations auth python pollute.py && \
	docker compose exec --workdir /opt/app/src/migrations storage python pollute.py
