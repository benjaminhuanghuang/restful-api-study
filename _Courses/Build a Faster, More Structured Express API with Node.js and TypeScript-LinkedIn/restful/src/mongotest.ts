import { model, connect, Schema } from "mongoose";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

interface IPost {
  content: string;
  author: string;
}
const postSchema = new Schema<IPost>({
  content: { type: String, required: true },
  author: { type: String, required: true },
});

export const client = new MongoClient(process.env.MONGO_URI!);
export const db = client.db("node-ts-api");

const Post = model<IPost>("Post", postSchema);

const connectToMongoDb = async () => {
  await connect(process.env.MONGO_URI!);
  const post = new Post({
    content: "First post!",
    author: "author0",
  });

  await post.save();
  console.log("connect");
};

connectToMongoDb();
