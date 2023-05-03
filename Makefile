run:
	docker-compose down --volumes && docker-compose up --build

run_dev:
	docker-compose -f docker-compose.dev.yaml down --volumes && docker-compose -f docker-compose.dev.yaml up --build --renew-anon-volumes

tests:
	docker-compose down --volumes && docker-compose build && docker-compose run --rm web sh -c "python manage.py test --nomigrations --noinput"

lint:
	docker-compose build && docker-compose run --rm web  sh -c "flake8"

docker_exec:
	docker exec -it sales_manager_api /bin/sh

clean_docker:
	docker rm -f $(docker ps -a -q)
