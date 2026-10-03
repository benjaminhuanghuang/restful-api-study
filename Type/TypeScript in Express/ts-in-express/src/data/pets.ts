import { Pet } from "../types";
export const pets: Pet[] = [
  {
    id: 1,
    name: "Fluffy",
    species: "cat",
    adopted: false,
    age: 3,
    intakeDate: new Date(),
    medicalRecord: {
      vaccinations: ["Rabies", "FVRCP"],
      weightKg: 4.5,
      microchipId: "123456789",
    },
    photo: "/images/fluffy.jpg",
  },
];
