import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  // a new resource was created on the server.
  // Most RESTful conventions use 201 when a POST results in new data being stored.
  res.status(201).send({ message: "User registered" });
});

router.post("/login", (req, res) => {
  res.status(200).send({ message: "User logged in" });
});

export default router;
