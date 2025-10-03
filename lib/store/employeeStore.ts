import { create } from 'zustand';
import type { Employee, CreateEmployeeInput, UUID } from '@/lib/types';
import { LocalStorageService } from '@/lib/services/localStorage';
import { generateId } from '@/lib/utils/helpers';

interface EmployeeStore {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  
  loadEmployees: () => void;
  addEmployee: (input: CreateEmployeeInput) => Employee;
  updateEmployee: (id: UUID, updates: Partial<Employee>) => void;
  deleteEmployee: (id: UUID) => void;
  getEmployeeById: (id: UUID) => Employee | undefined;
  getEmployeesByQualification: (qualification: string) => Employee[];
  setEmployeeStatus: (id: UUID, status: Employee['status']) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,

  loadEmployees: () => {
    set({ isLoading: true });
    try {
      const employees = LocalStorageService.getEmployees<Employee>();
      set({ employees, isLoading: false });
    } catch (error) {
      set({ error: 'Fehler beim Laden der Mitarbeiter', isLoading: false });
    }
  },

  addEmployee: (input: CreateEmployeeInput) => {
    const now = new Date().toISOString();
    const employee: Employee = {
      id: generateId(),
      ...input,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    const employees = [...get().employees, employee];
    LocalStorageService.setEmployees(employees);
    set({ employees });
    
    return employee;
  },

  updateEmployee: (id: UUID, updates: Partial<Employee>) => {
    const employees = get().employees.map(emp =>
      emp.id === id
        ? { ...emp, ...updates, updatedAt: new Date().toISOString() }
        : emp
    );
    
    LocalStorageService.setEmployees(employees);
    set({ employees });
  },

  deleteEmployee: (id: UUID) => {
    const employees = get().employees.filter(emp => emp.id !== id);
    LocalStorageService.setEmployees(employees);
    set({ employees });
  },

  getEmployeeById: (id: UUID) => {
    return get().employees.find(emp => emp.id === id);
  },

  getEmployeesByQualification: (qualification: string) => {
    return get().employees.filter(emp =>
      emp.qualifications.includes(qualification as any)
    );
  },

  setEmployeeStatus: (id: UUID, status: Employee['status']) => {
    get().updateEmployee(id, { status });
  },
}));

