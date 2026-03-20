import mongoose from "mongoose";

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Database connected");
});

const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/shipment-management-api")
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    });
};

const connectDBTest = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/shipment-management-api")
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    });
};

const connect =
  process.env.NODE_ENV === "production" ? connectDB : connectDBTest;

export default connect;
