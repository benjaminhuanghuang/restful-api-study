import type { Request, Response } from "express";

import { pets } from "../data/pets";
import { Pet } from "../types";

type QueryParams = {
  species?: string;
  adopted?: "true" | "false";
  minAge?: string;
  maxAge?: string;
};

// get pets by species /?species=dog
export const getPets = (
  req: Request<{}, unknown, {}, QueryParams>,
  res: Response<Pet[]>
): void => {
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
};

// get pet by id
export const getPetById = (
  req: Request<{ id: string }>,
  res: Response<Pet | { message: string }>
): void => {
  const { id } = req.params;
  const pet: Pet | undefined = pets.find(
    (p: Pet): boolean => p.id === parseInt(id, 10)
  );
  if (pet) {
    res.json(pet);
  } else {
    res.status(404).json({ message: "Pet not found" });
  }
};
