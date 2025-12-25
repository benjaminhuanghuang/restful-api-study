# 1. Welcome to Your API

## Setup

```sh
npm init -y

npm install -D typescript ts-node @types/node @types/express @types/cors

npx tsc --init

"rootDir": "./src"
"moduleResolution": "node10",
"outDir": "./build",
"exclude": ["./tests", "./build", "./node_modules"]

```

## Mongo DB

https://cloud.mongodb.com/

Log in to your MongoDB account.
From the homepage, click the New Project button.
Name your project (e.g., node-ts-api), then click Next.
Keep yourself as the project owner and click Create Project.
In the overview, click the green Create button.
Use the default settings for your database and select the free version.
Click Create to proceed.
In the Security Quickstart, create a user with admin permissions.
Add the IP address 0.0.0.0 to your access list for efficiency.
Click Finish and Close.

```sh
npm i mongodb mongoose dotenv
```

### Add Data

```js
await connect(process.env.MONGO_URI!, {
    dbName: "faster-api",
});

const post = new Post({
    content: "First post!",
    author: "author0",
});

await post.save();
```
