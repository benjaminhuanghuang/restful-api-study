# Setup mongoDB

```sh
npm i mongoose
npm i -D mongodb-memory-server  # in-memory mongod for tests, no local install needed
```

## src/db/connection.ts

```ts
import mongoose from "mongoose";

export async function connectDB(uri: string = process.env.MONGO_URI!) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
```

## src/modules/users/user.model.ts

```ts
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const UserModel = mongoose.model("User", userSchema);
```

## Querying

```ts
await UserModel.find().sort({ createdAt: -1 });
await UserModel.findById(id);
await UserModel.create({ name, email, age });
await UserModel.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true });
await UserModel.findByIdAndDelete(id);
```

Note: mongoose 9 renamed the `findOneAndUpdate`/`findByIdAndUpdate` option `new: true` to
`returnDocument: "after"` — using `new` still works but logs a deprecation warning.

## Testing with mongodb-memory-server

```ts
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```
