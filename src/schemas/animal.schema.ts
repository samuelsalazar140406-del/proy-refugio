import { z } from 'zod';

export const animalSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100),
  raza: z.string().trim().min(1, 'La raza es obligatoria').max(100),
  edad: z.coerce.number().int('La edad debe ser un numero entero').nonnegative('La edad no puede ser negativa'),
  sexo: z.enum(['Hembra', 'Macho']),
  tipoAnimal: z.enum(['Perro', 'Gato']),
});
