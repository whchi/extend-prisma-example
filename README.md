## 0. start docker
```sh
docker-compose up -d
```

## 1. Install the Prisma CLI

```sh
brew tap prisma/prisma
brew install prisma
```

## 2. Configure your Prisma API

```sh
# workspace -> your work space
# env -> workspace's env
cp .env.example .env
```
Which will generate a database named "workspace@env" in MySQL after deploy.

## 3. Deploy the Prisma datamodel

```sh
prisma deploy
prisma generate
```

[data manage UI](http://localhost:4466/workspace/env/_admin)

[query UI](http://localhost:4466/workspace/env)

## 4. Read and write data using the Prisma client

build api service

```bash
yarn install
yarn start
```
## 5. Usage
```sh
cp .env.example .env
prisma token -e .env
# paste to playground header as bearer token
```
connect to `http://localhost:4000`
set host: `http://localhost:4466/workspace/env`

* create member
```gql
mutation {
  createMember(data: { account: "asd", email: "email", name: "name" }) {
    id
  }
}
```
* query member
```gql
query {
  member(where: {email: "test"}) {
  	id
  }
}
```
