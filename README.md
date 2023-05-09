# Sales Manager

### Stack:
- Docker compose
- NestJS
- Postgres


### First Run:
1. 

### Assumptions 
1. A Seller could be an Affiliate and vice versa

### Key-Approachs
1. pg-mem for e2e tests
2. mock-fs for tests with real text files 

### Next steps:
### API: 
- Deal with duplicated Transactions (e.g. upload the same file multiple times)
- Multer.File configuration or even use another approach
- Replace sales_test.txt file for on the fly generated one at e2e tests (maybe multer.diskStorage).
- Improve parse validation
- Implement Pagination 
- Improve the upload -> read in memory -> save in db approach. Maybe change to save in some storage to then insert in db (maybe multer.diskStorage).
- Improve the Express.Multer.File usage to prevent malicious code when uploading files
- Mult-file upload
- Remove duplicated mock code in tests files
- Setup nest-alias for deal with importing files
- Create custom exceptions
- Improve exceptions messages to became user friendly.

### Web
- Balance Page: Replace free input text by a drop-down one
- Add Material UI lib