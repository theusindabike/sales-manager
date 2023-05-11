# Sales Manager
A sales transactions aggregator.

## Stack:
- NestJS
- React
- Postgres
- Docker Compose


## First Run:

```sh
# using makefile
make run_dev

# using docker-compose
docker-compose -f docker-compose.dev.yaml down --volumes && docker-compose -f docker-compose.dev.yaml up --build --renew-anon-volumes
```



### Assumptions 
1. A Seller could be an Affiliate and vice versa

### Key approachs for e2e tests
1. [pg-mem](https://github.com/oguimbal/pg-mem)
2. [mock-fs](https://github.com/tschaub/mock-fs)

## Next steps:
### API: 
- Deal with duplicated Transactions.
- Improve domain approach. (e.g. transaction, seller/affiliate, products separately)
- Improve Multer.File configuration (e.g to prevent malicious code when uploading files)
- Implement pagination for transactions
- Improve the upload -> read in memory -> save in db approach. Maybe change to save in some storage to then insert in db (maybe multer.diskStorage).
- Setup nest-alias for deal with importing files
- Create custom exceptions
- Improve exception messages to become user friendly.

### Web
- Add tests
- Balance Page: Replace free input text by a drop-down one
- Add Material UI lib