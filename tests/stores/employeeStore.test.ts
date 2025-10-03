import { useEmployeeStore } from '@/lib/store/employeeStore';
import type { CreateEmployeeInput } from '@/lib/types';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Employee Store', () => {
  beforeEach(() => {
    useEmployeeStore.setState({ employees: [] });
  });

  it('should add a new employee', () => {
    const input: CreateEmployeeInput = {
      name: 'Test Employee',
      qualifications: ['grundpflege', 'medikamente'],
      maxHoursPerDay: 8,
      contact: {
        phone: '+49 123 456789',
        email: 'test@example.com',
      },
      availability: {
        monday: [{ start: '08:00', end: '16:00' }],
        tuesday: [{ start: '08:00', end: '16:00' }],
        wednesday: [{ start: '08:00', end: '16:00' }],
        thursday: [{ start: '08:00', end: '16:00' }],
        friday: [{ start: '08:00', end: '16:00' }],
        saturday: [],
        sunday: [],
      },
    };

    const employee = useEmployeeStore.getState().addEmployee(input);

    expect(employee.name).toBe('Test Employee');
    expect(employee.qualifications).toContain('grundpflege');
    expect(employee.status).toBe('active');
    expect(useEmployeeStore.getState().employees).toHaveLength(1);
  });

  it('should update an employee', () => {
    const input: CreateEmployeeInput = {
      name: 'Test Employee',
      qualifications: ['grundpflege'],
      maxHoursPerDay: 8,
      contact: { phone: '+49 123' },
      availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    };

    const employee = useEmployeeStore.getState().addEmployee(input);
    useEmployeeStore.getState().updateEmployee(employee.id, { name: 'Updated Name' });

    const updated = useEmployeeStore.getState().getEmployeeById(employee.id);
    expect(updated?.name).toBe('Updated Name');
  });

  it('should delete an employee', () => {
    const input: CreateEmployeeInput = {
      name: 'Test Employee',
      qualifications: ['grundpflege'],
      maxHoursPerDay: 8,
      contact: { phone: '+49 123' },
      availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    };

    const employee = useEmployeeStore.getState().addEmployee(input);
    useEmployeeStore.getState().deleteEmployee(employee.id);

    expect(useEmployeeStore.getState().employees).toHaveLength(0);
  });

  it('should get employees by qualification', () => {
    const input1: CreateEmployeeInput = {
      name: 'Employee 1',
      qualifications: ['grundpflege', 'medikamente'],
      maxHoursPerDay: 8,
      contact: { phone: '+49 123' },
      availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    };

    const input2: CreateEmployeeInput = {
      name: 'Employee 2',
      qualifications: ['grundpflege'],
      maxHoursPerDay: 8,
      contact: { phone: '+49 456' },
      availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    };

    useEmployeeStore.getState().addEmployee(input1);
    useEmployeeStore.getState().addEmployee(input2);

    const withMedikamente = useEmployeeStore.getState().getEmployeesByQualification('medikamente');
    expect(withMedikamente).toHaveLength(1);
    expect(withMedikamente[0].name).toBe('Employee 1');
  });
});

