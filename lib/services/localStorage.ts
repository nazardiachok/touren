const STORAGE_KEYS = {
  EMPLOYEES: 'pflege_touren_employees',
  RESIDENTS: 'pflege_touren_residents',
  TOURS: 'pflege_touren_tours',
  TASKS: 'pflege_touren_tasks',
  WEEK_PLANS: 'pflege_touren_week_plans',
} as const;

export class LocalStorageService {
  private static isClient = typeof window !== 'undefined';

  static get<T>(key: string): T | null {
    if (!this.isClient) return null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }

  static set<T>(key: string, value: T): boolean {
    if (!this.isClient) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }

  static remove(key: string): boolean {
    if (!this.isClient) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isClient) return false;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  static getEmployees<T>(): T[] {
    return this.get<T[]>(STORAGE_KEYS.EMPLOYEES) || [];
  }

  static setEmployees<T>(employees: T[]): boolean {
    return this.set(STORAGE_KEYS.EMPLOYEES, employees);
  }

  static getResidents<T>(): T[] {
    return this.get<T[]>(STORAGE_KEYS.RESIDENTS) || [];
  }

  static setResidents<T>(residents: T[]): boolean {
    return this.set(STORAGE_KEYS.RESIDENTS, residents);
  }

  static getTours<T>(): T[] {
    return this.get<T[]>(STORAGE_KEYS.TOURS) || [];
  }

  static setTours<T>(tours: T[]): boolean {
    return this.set(STORAGE_KEYS.TOURS, tours);
  }

  static getTasks<T>(): T[] {
    return this.get<T[]>(STORAGE_KEYS.TASKS) || [];
  }

  static setTasks<T>(tasks: T[]): boolean {
    return this.set(STORAGE_KEYS.TASKS, tasks);
  }

  static exportData(): string {
    if (!this.isClient) return '{}';
    
    const data = {
      employees: this.getEmployees(),
      residents: this.getResidents(),
      tours: this.getTours(),
      tasks: this.getTasks(),
      exportedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonString: string): boolean {
    if (!this.isClient) return false;
    
    try {
      const data = JSON.parse(jsonString);
      
      if (data.employees) this.setEmployees(data.employees);
      if (data.residents) this.setResidents(data.residents);
      if (data.tours) this.setTours(data.tours);
      if (data.tasks) this.setTasks(data.tasks);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

