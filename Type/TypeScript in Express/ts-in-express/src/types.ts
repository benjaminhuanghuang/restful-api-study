export type Pet = {
  id: number;
  name: string;
  species: string;
  adopted: boolean;
  age: number;
  intakeDate: Date;
  adoptionDate?: Date;
  medicalRecord: {
    vaccinations: string[];
    weightKg: number;
    microchipId?: string;
  };
  photo: string;
};
