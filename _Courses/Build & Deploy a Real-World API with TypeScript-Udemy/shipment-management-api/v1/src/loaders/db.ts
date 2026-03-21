import mongoose from "mongoose";

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Database connected");
});

const connectDB = () => {
  mongoose
    .connect(
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`,
    )
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    });
};

const connectDBTest = () => {
  mongoose.connect(process.env.MONGO_URI!).catch((error) => {
    console.error("Error connecting to the database:", error);
  });
};

const connect =
  process.env.NODE_ENV === "production" ? connectDB : connectDBTest;

export default connect;
