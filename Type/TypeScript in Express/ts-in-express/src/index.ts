import express from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";

import { pets } from "./data/pets";
import { Pet } from "./types";

const PORT = 8000;
const app: Express = express();

// Middleware
app.use(cors());

// get all pets
app.get("/", (req: Request, res: Response<Pet[]>) => {
  res.json(pets);
});

// get pets by species /?species=dog
type QueryParams = {
  species?: string;
  adopted?: "true" | "false";
  minAge?: string;
  maxAge?: string;
};

app.get(
  "/",
  (req: Request<{}, unknown, {}, QueryParams>, res: Response<Pet[]>) => {
    const { species, adopted, minAge, maxAge } = req.query;
    let filteredPets = pets;
    if (species) {
      filteredPets = filteredPets.filter((p: Pet) => p.species === species);
    }
    if (adopted) {
      filteredPets = filteredPets.filter(
        (p: Pet) => p.adopted === JSON.parse(adopted)
      );
    }
    if (minAge) {
      filteredPets = filteredPets.filter(
        (p: Pet) => p.age >= parseInt(minAge, 10)
      );
    }
    if (maxAge) {
      filteredPets = filteredPets.filter(
        (p: Pet) => p.age <= parseInt(maxAge, 10)
      );
    }
    res.json(filteredPets);
  }
);

// get pet by id
app.get(
  "/:id",
  (req: Request<{ id: string }>, res: Response<Pet | { message: string }>) => {
    const { id } = req.params;
    const pet: Pet | undefined = pets.find(
      (p: Pet): boolean => p.id === parseInt(id, 10)
    );
    if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: "Pet not found" });
    }
  }
);

// 404 handler
app.use((req: Request, res: Response<{ message: string }>): void => {
  res.status(404).json({ message: "No route found" });
});

app.listen(PORT, (): void => {
  console.log("Listening on port: ", PORT);
});
