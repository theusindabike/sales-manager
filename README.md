# Sales Manager

### Stack:
- Docker compose
- NestJS
- React
- Postgres


### First Run:

1. 

### Assumptions 
1. A Seller could be an Affiliate and vice versa

### Next steps:
- Fix value parse to consider cents
- Replace sales_test.txt file for on the fly generated one at e2e tests (maybe multer.diskStorage).
- Implement Pagination 
- Improve the upload -> read in memory -> save in db approach. Maybe change to save in some storage to then insert in db (maybe multer.diskStorage).
- Improve the Express.Multer.File usage to prevent malicious code when uploading files
- Mult-file upload
