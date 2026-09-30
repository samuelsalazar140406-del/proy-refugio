import type { Animal, AnimalFilters, AnimalPayload } from '../../types/animal';
import { apiRequest } from './client';

const normalize = (animal: Animal): Animal => ({ ...animal, tipoanimal: animal.tipoanimal ?? (animal as Animal & { tipoAnimal?: Animal['tipoanimal'] }).tipoAnimal! });

export const listAnimals = async (filters: AnimalFilters = {}): Promise<Animal[]> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
  const animals = await apiRequest<Animal[]>(`/animals${params.size ? `?${params}` : ''}`);
  return animals.map(normalize);
};

export const createAnimal = (payload: AnimalPayload) => apiRequest<Animal>('/animals', {
  method: 'POST', body: JSON.stringify(payload),
});

export const updateAnimal = (id: number, payload: AnimalPayload) => apiRequest<Animal>(`/animals/${id}`, {
  method: 'PUT', body: JSON.stringify(payload),
});
