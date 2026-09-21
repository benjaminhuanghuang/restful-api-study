import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from a .env file into process.env

import app from "./server";

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
