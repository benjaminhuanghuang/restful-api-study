import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.send("<button>Health Check</button>");
});

app.get("/cake/:name", (req, res) => {
  res.send(req.params.name);
});

app.post("/cake", (req, res) => {
  res.send({ message: "User created" });
});

// Export the app for use in other modules (like tests)
export { app };

// Default export for convenience
export default app;
