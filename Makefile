run_dev:
	docker-compose -f docker-compose.dev.yaml down --volumes && docker-compose -f docker-compose.dev.yaml up --build --renew-anon-volumes

docker_exec:
	docker exec -it sales_manager_api /bin/sh

clean_docker:
	docker rm -f $(docker ps -a -q)
