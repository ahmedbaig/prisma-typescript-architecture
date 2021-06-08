### Setup Instructions
- npm i
- npm i -g @prima/client
- prisma migrate dev
- prisma studio
- docker run --name redis -p 6379:6379 -d redis
- docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres
- docker run --name pgadmin4 -p 10001:80 -e PGADMIN_DEFAULT_EMAIL=user@domain.com -e PGADMIN_DEFAULT_PASSWORD=SuperSecret -d dpage/pgadmin4

### Forkable Collection
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/15958771-88c7c932-eae2-4adf-a0a2-a1565239750f?action=collection%2Ffork&collection-url=entityId%3D15958771-88c7c932-eae2-4adf-a0a2-a1565239750f%26entityType%3Dcollection%26workspaceId%3De2c0facf-4ccb-4d47-85db-2becb50b59c5)


### Published Postman Documentation
[![View Documentation](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/15958771/TzY69EUQ)