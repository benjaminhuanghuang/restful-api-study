# TypeScript in Express – TypeScript Tutorial

<https://www.youtube.com/watch?v=bYgphDEWwvs>
[中配](https://www.bilibili.com/video/BV1cMHe6HE1z?t=276.4)

## Setting up an Express & TypeScript project

```sh
npm init -y
npm i express cors
npm i -D typescript @types/express @types/cors
npm i -D tsx
```

tsconfig.json

```sh
npm install -D @tsconfig/node20
```

```json
"extends": "@tsconfig/node20/tsconfig.json"
"compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
}
```

## Running an Express & TypeScript project

```json
"build":"npx tsc",
"start":"npx tsc && node dist/index.js",
"dev": "tsx watch src/index.ts"
```

## Typing Express data

## Restarting the Express server

## Typing the real data

## Request and Response types

## cors and TypeScript

## Typing the 404 catch-all

## Automating the server restart

## A more specific Response

## A more specific Request

## Non-existent IDs

```js
app.get(
  "/:id",
  (req: Request<{ id: string }>, res: Response<Pet | { message: string }>) => {
  
})
```

## String query params

## An even more specific Request

```ts
type QueryParams = {
  species?: string;
  adopted?: "true" | "false";
};
```

## Boolean query params

## Number query params

## Separating concerns with Router ✅

## Separating concerns with controllers ✅

## Adding and typing middleware

```ts
petRouter.get("/:id", validateNumericId, getPetById);
```

## Your own middleware

## Congratulations
