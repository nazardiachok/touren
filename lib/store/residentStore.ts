import { create } from 'zustand';
import type { Resident, CreateResidentInput, UUID } from '@/lib/types';
import { LocalStorageService } from '@/lib/services/localStorage';
import { generateId } from '@/lib/utils/helpers';

interface ResidentStore {
  residents: Resident[];
  isLoading: boolean;
  error: string | null;
  
  loadResidents: () => void;
  addResident: (input: CreateResidentInput) => Resident;
  updateResident: (id: UUID, updates: Partial<Resident>) => void;
  deleteResident: (id: UUID) => void;
  getResidentById: (id: UUID) => Resident | undefined;
  getResidentsByCareLevel: (careLevel: number) => Resident[];
  setResidentStatus: (id: UUID, status: Resident['status']) => void;
}

export const useResidentStore = create<ResidentStore>((set, get) => ({
  residents: [],
  isLoading: false,
  error: null,

  loadResidents: () => {
    set({ isLoading: true });
    try {
      const residents = LocalStorageService.getResidents<Resident>();
      set({ residents, isLoading: false });
    } catch (error) {
      set({ error: 'Fehler beim Laden der Bewohner', isLoading: false });
    }
  },

  addResident: (input: CreateResidentInput) => {
    const now = new Date().toISOString();
    const resident: Resident = {
      id: generateId(),
      ...input,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    const residents = [...get().residents, resident];
    LocalStorageService.setResidents(residents);
    set({ residents });
    
    return resident;
  },

  updateResident: (id: UUID, updates: Partial<Resident>) => {
    const residents = get().residents.map(res =>
      res.id === id
        ? { ...res, ...updates, updatedAt: new Date().toISOString() }
        : res
    );
    
    LocalStorageService.setResidents(residents);
    set({ residents });
  },

  deleteResident: (id: UUID) => {
    const residents = get().residents.filter(res => res.id !== id);
    LocalStorageService.setResidents(residents);
    set({ residents });
  },

  getResidentById: (id: UUID) => {
    return get().residents.find(res => res.id === id);
  },

  getResidentsByCareLevel: (careLevel: number) => {
    return get().residents.filter(res => res.careLevel === careLevel);
  },

  setResidentStatus: (id: UUID, status: Resident['status']) => {
    get().updateResident(id, { status });
  },
}));

