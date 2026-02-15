import express from "express";

const router = express.Router();

router.get("/movies", (req, res) => {
  res.send("List of movies");
});

export default router;
