import { animalSchema } from '../schemas/animal.schema';
import { createAnimal, listAnimals, updateAnimal } from '../lib/api/animals.api';
import { logoutRequest } from '../lib/api/auth.api';
import { ApiError } from '../lib/api/client';
import { clearToken, getToken } from '../lib/auth/session';
import type { Animal, AnimalFilters } from '../types/animal';

const token = getToken();
if (!token) window.location.href = '/login';

const grid = document.querySelector<HTMLDivElement>('#animals-grid');
const status = document.querySelector<HTMLDivElement>('#animals-status');
const filterForm = document.querySelector<HTMLFormElement>('#filters-form');
const modal = document.querySelector<HTMLDivElement>('#animal-modal');
const form = document.querySelector<HTMLFormElement>('#animal-form');
const formError = document.querySelector<HTMLParagraphElement>('#form-error');
let editingId: number | null = null;
let animals: Animal[] = [];

const escapeHtml = (value: string | number) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char);

const showStatus = (message: string, danger = false) => {
  if (!status) return;
  status.textContent = message;
  status.className = `mt-8 rounded-2xl px-4 py-3 text-sm font-semibold ${danger ? 'bg-red-50 text-red-700' : 'bg-lagoon/10 text-lagoon'}`;
};

const renderAnimals = () => {
  if (!grid) return;
  if (!animals.length) { grid.innerHTML = '<div class="col-span-full rounded-3xl border border-dashed border-ink/15 px-6 py-16 text-center text-sm text-ink/50">No encontramos animales con esos filtros.</div>'; return; }
  grid.innerHTML = animals.map((animal) => `<article class="group overflow-hidden rounded-[2rem] border border-ink/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-float"><div class="relative h-32 overflow-hidden p-5 ${animal.tipoanimal === 'Perro' ? 'bg-lagoon' : 'bg-marigold'}"><span class="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.14em] ${animal.tipoanimal === 'Perro' ? 'text-white' : 'text-ink'}">${escapeHtml(animal.tipoanimal)}</span><span class="absolute -bottom-5 left-5 grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl shadow-lg">${animal.tipoanimal === 'Perro' ? '🐶' : '🐱'}</span></div><div class="p-5 pt-8"><div class="flex items-start justify-between gap-3"><div><h3 class="font-display text-2xl leading-none text-ink">${escapeHtml(animal.nombre)}</h3><p class="mt-1 text-xs font-semibold text-ink/50">${escapeHtml(animal.raza)}</p></div><span class="rounded-full bg-shell px-2.5 py-1 text-xs font-bold text-ink/60">${animal.edad} ${animal.edad === 1 ? 'ano' : 'anos'}</span></div><div class="mt-5 flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-ink/55"><span>${escapeHtml(animal.sexo)}</span><span>${new Date(animal.fechaingreso).toLocaleDateString('es-MX')}</span></div><button data-edit-animal="${animal.identificador}" class="mt-4 w-full rounded-xl border border-lagoon/20 py-2.5 text-xs font-extrabold uppercase tracking-[0.12em] text-lagoon transition hover:bg-lagoon hover:text-white">Editar ficha</button></div></article>`).join('');
};

const loadAnimals = async (filters: AnimalFilters = {}) => {
  showStatus('Cargando registros...');
  try { animals = await listAnimals(filters); renderAnimals(); status?.classList.add('hidden'); }
  catch (error) { if (error instanceof ApiError && error.status === 401) { clearToken(); window.location.href = '/login'; return; } showStatus(error instanceof Error ? error.message : 'No se pudieron cargar los registros', true); }
};

const openModal = (animal?: Animal) => {
  if (!modal || !form) return;
  editingId = animal?.identificador ?? null;
  (document.querySelector('#modal-title') as HTMLElement).textContent = animal ? 'Editar registro' : 'Nuevo registro';
  form.reset();
  if (animal) { for (const [key, value] of Object.entries({ nombre: animal.nombre, raza: animal.raza, edad: animal.edad, sexo: animal.sexo, tipoAnimal: animal.tipoanimal })) { const field = form.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement | null; if (field) field.value = String(value); } }
  formError?.classList.add('hidden'); modal.classList.remove('hidden'); modal.classList.add('flex');
};
const closeModal = () => { modal?.classList.add('hidden'); modal?.classList.remove('flex'); editingId = null; };

filterForm?.addEventListener('input', () => { const data = new FormData(filterForm); loadAnimals(Object.fromEntries([...data].filter(([, value]) => value)) as AnimalFilters); });
document.querySelector('#new-animal-button')?.addEventListener('click', () => openModal());
document.querySelector('#close-modal')?.addEventListener('click', closeModal);
document.querySelector('#cancel-modal')?.addEventListener('click', closeModal);
grid?.addEventListener('click', (event) => { const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-edit-animal]'); const animal = animals.find((item) => item.identificador === Number(button?.dataset.editAnimal)); if (animal) openModal(animal); });
form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const parsed = animalSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) { if (formError) { formError.textContent = parsed.error.issues[0]?.message ?? 'Revisa los datos'; formError.classList.remove('hidden'); } return; }
  try { if (editingId) await updateAnimal(editingId, parsed.data); else await createAnimal(parsed.data); closeModal(); await loadAnimals(); }
  catch (error) { if (formError) { formError.textContent = error instanceof Error ? error.message : 'No se pudo guardar'; formError.classList.remove('hidden'); } }
});
document.querySelector('#logout-button')?.addEventListener('click', async () => { try { await logoutRequest(); } finally { clearToken(); window.location.href = '/login'; } });
loadAnimals();
