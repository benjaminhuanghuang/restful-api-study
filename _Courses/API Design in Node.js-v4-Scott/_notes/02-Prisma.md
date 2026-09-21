# Prisma

## What is Prisma

Prisma is a DB agnostic, type safe ORM. It supports most DB's out there. It not only has an SDK for
doing basic to advanced querying of a DB, but also handles schemas, migrations, seeding, and
sophisticated writes. It's slowly but surely becoming the ORM of choice for Node.js projects.

setup

```sh
npm i typescript ts-node @types/node prisma -D

npx prisma init
```

install Prisma extension for VS code

Create Postgres DB on https://dashboard.render.com
Copy External Database URL

DO NOT use "type": "module" in package.json

## Create model

```sh
npx prisma format
```

## Migrations

```sh
npm i @prisma/client

npx prisma migrate dev --name init

npx prisma migrate reset


npx prisma studio
```
