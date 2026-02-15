# Backend Complete Course | NodeJS, ExpressJS, JWT, PostgreSQL, Prisma...

⭐️⭐️⭐️⭐️⭐️

https://www.youtube.com/watch?v=g09PoiCob4Y

https://github.com/machadop1407/NodeJS-ExpressJS-BackendCourse

```sh
npm init -y


npm i express cors bcryptjs jsonwebtoken zod
npm i -D tsx
```

## DB

Use neon db ben-study

Add DATABASE_URL into .env

## Prisma

https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/postgresql

```sh
npx prisma init
# Create prisma folder and prisma.config.ts

npm i -D prisma
npm i @prisma/client

#
# Create model, then create the database tables
#
npx prisma migrate dev --name add_users_table


# generate the Prisma Client
npx prisma generate

# to latest version
npx prisma migrate dev
```

Create /lib/ prisma.js

## Auth

Create JWT_SECRET

```sh
openssl rand -base64 32
```

## Middleware

```js
// Check token
if (
  req.headers.authorization &&
  req.headers.authorization.startsWith("Bearer")
) {
  token = req.headers.authorization.split(" ")[1];
} else if (req.cookies?.jwt) {
  token = req.cookies.jwt;
}

// Apply auth middleware
router.use(authMiddleware);
```

## Validation using ZOD
