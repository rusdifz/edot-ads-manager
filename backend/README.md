# ads-manager-backend
ads manager edot backend using gqlgen, gin, and gorm

# setup requirement
1. golang development environment on local machine
2. docker on local machine (optional)

## gqlgen generate from graphql schema
1. update graph schema on file graph/schema.graphqls
2. run in terminal from root
```
go generate ./...
```

## setup/run local db environment
if you have docker installed,

build docker compose, run in terminal from root:
```
docker compose build
```

start docker compose:
```
docker compose up
```

to remove docker containers:
```
docker compose down
```

if you don't have docker installed, setup postgresql on local machine manually and create 1 db for the project

## setup environment variable
1. create .env file
2. insert below variables
POSTGRES_HOST = [pg_host]
POSTGRES_USER = [pg_user]
POSTGRES_PASSWORD = [pg_password]
POSTGRES_DB = [db_name_for_this_project]
POSTGRES_PORT = [localhost_port_used]
GIN_PORT = :[gin_port]

## run development app
1. run in terminal from root:
```
air
```
2. open graphiql/graphql playground from browser --> localhost:8080
3. the repo comes with hot reload functionality, change in code will trigger rebuild. happy coding!