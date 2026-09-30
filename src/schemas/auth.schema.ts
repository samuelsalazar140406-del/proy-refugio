import { z } from 'zod';

export const loginSchema = z.object({
  usuario: z.string().trim().min(1, 'Escribe tu usuario').max(15, 'Maximo 15 caracteres'),
  contrasena: z.string().min(1, 'Escribe tu contrasena').max(60, 'Maximo 60 caracteres'),
});
