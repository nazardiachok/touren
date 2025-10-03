import { create } from 'zustand';
import type { Tour, Task, CreateTourInput, CreateTaskInput, UUID } from '@/lib/types';
import { LocalStorageService } from '@/lib/services/localStorage';
import { generateId } from '@/lib/utils/helpers';

interface TourStore {
  tours: Tour[];
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  loadTours: () => void;
  loadTasks: () => void;
  addTour: (input: CreateTourInput) => Tour;
  updateTour: (id: UUID, updates: Partial<Tour>) => void;
  deleteTour: (id: UUID) => void;
  getTourById: (id: UUID) => Tour | undefined;
  getToursByDate: (date: string) => Tour[];
  getToursByEmployee: (employeeId: UUID) => Tour[];
  
  addTask: (input: CreateTaskInput) => Task;
  updateTask: (id: UUID, updates: Partial<Task>) => void;
  deleteTask: (id: UUID) => void;
  getTaskById: (id: UUID) => Task | undefined;
  getTasksByTour: (tourId: UUID) => Task[];
  getTasksByResident: (residentId: UUID) => Task[];
  setTaskStatus: (id: UUID, status: Task['status']) => void;
}

export const useTourStore = create<TourStore>((set, get) => ({
  tours: [],
  tasks: [],
  isLoading: false,
  error: null,

  loadTours: () => {
    set({ isLoading: true });
    try {
      const tours = LocalStorageService.getTours<Tour>();
      set({ tours, isLoading: false });
    } catch (error) {
      set({ error: 'Fehler beim Laden der Touren', isLoading: false });
    }
  },

  loadTasks: () => {
    try {
      const tasks = LocalStorageService.getTasks<Task>();
      set({ tasks });
    } catch (error) {
      set({ error: 'Fehler beim Laden der Aufgaben' });
    }
  },

  addTour: (input: CreateTourInput) => {
    const now = new Date().toISOString();
    const tour: Tour = {
      id: generateId(),
      ...input,
      tasks: [],
      status: 'planned',
      createdAt: now,
      updatedAt: now,
    };

    const tours = [...get().tours, tour];
    LocalStorageService.setTours(tours);
    set({ tours });
    
    return tour;
  },

  updateTour: (id: UUID, updates: Partial<Tour>) => {
    const tours = get().tours.map(tour =>
      tour.id === id
        ? { ...tour, ...updates, updatedAt: new Date().toISOString() }
        : tour
    );
    
    LocalStorageService.setTours(tours);
    set({ tours });
  },

  deleteTour: (id: UUID) => {
    const tasks = get().tasks.filter(task => task.tourId !== id);
    LocalStorageService.setTasks(tasks);
    
    const tours = get().tours.filter(tour => tour.id !== id);
    LocalStorageService.setTours(tours);
    
    set({ tours, tasks });
  },

  getTourById: (id: UUID) => {
    return get().tours.find(tour => tour.id === id);
  },

  getToursByDate: (date: string) => {
    return get().tours.filter(tour => tour.date === date);
  },

  getToursByEmployee: (employeeId: UUID) => {
    return get().tours.filter(tour => tour.employeeId === employeeId);
  },

  addTask: (input: CreateTaskInput) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      ...input,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const tasks = [...get().tasks, task];
    LocalStorageService.setTasks(tasks);
    
    const tours = get().tours.map(tour =>
      tour.id === task.tourId
        ? { ...tour, tasks: [...tour.tasks, task] }
        : tour
    );
    LocalStorageService.setTours(tours);
    
    set({ tasks, tours });
    
    return task;
  },

  updateTask: (id: UUID, updates: Partial<Task>) => {
    const tasks = get().tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    
    LocalStorageService.setTasks(tasks);
    
    const tours = get().tours.map(tour => ({
      ...tour,
      tasks: tour.tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
    LocalStorageService.setTours(tours);
    
    set({ tasks, tours });
  },

  deleteTask: (id: UUID) => {
    const tasks = get().tasks.filter(task => task.id !== id);
    LocalStorageService.setTasks(tasks);
    
    const tours = get().tours.map(tour => ({
      ...tour,
      tasks: tour.tasks.filter(task => task.id !== id),
    }));
    LocalStorageService.setTours(tours);
    
    set({ tasks, tours });
  },

  getTaskById: (id: UUID) => {
    return get().tasks.find(task => task.id === id);
  },

  getTasksByTour: (tourId: UUID) => {
    return get().tasks.filter(task => task.tourId === tourId);
  },

  getTasksByResident: (residentId: UUID) => {
    return get().tasks.filter(task => task.residentId === residentId);
  },

  setTaskStatus: (id: UUID, status: Task['status']) => {
    get().updateTask(id, { status });
  },
}));

