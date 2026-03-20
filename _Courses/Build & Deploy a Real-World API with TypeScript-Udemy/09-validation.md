# Validation Layer

```sh
npm i joi
```

## middleware

v1/src/middlewares/validate.ts

## Router

```ts
router.route("/").post(validate(validationSchemas.create), User.create);
```
