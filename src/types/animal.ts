export type Sex = 'Hembra' | 'Macho';
export type AnimalType = 'Perro' | 'Gato';

export interface Animal {
  identificador: number;
  nombre: string;
  raza: string;
  edad: number;
  sexo: Sex;
  fechaingreso: string;
  tipoanimal: AnimalType;
}

export interface AnimalPayload {
  nombre: string;
  raza: string;
  edad: number;
  sexo: Sex;
  tipoAnimal: AnimalType;
}

export interface AnimalFilters {
  nombre?: string;
  raza?: string;
  sexo?: Sex;
  tipoAnimal?: AnimalType;
}
