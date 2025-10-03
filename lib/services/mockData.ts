import type { Employee, Resident } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

export const generateMockEmployees = (): Employee[] => {
  const now = new Date().toISOString();
  
  return [
    {
      id: generateId(),
      name: 'Anna Schmidt',
      qualifications: ['grundpflege', 'medikamente', 'wundversorgung'],
      maxHoursPerDay: 8,
      contact: {
        phone: '+49 151 12345678',
        email: 'anna.schmidt@pflege.de',
      },
      availability: {
        monday: [{ start: '07:00', end: '15:00' }],
        tuesday: [{ start: '07:00', end: '15:00' }],
        wednesday: [{ start: '07:00', end: '15:00' }],
        thursday: [{ start: '07:00', end: '15:00' }],
        friday: [{ start: '07:00', end: '15:00' }],
        saturday: [],
        sunday: [],
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Michael Weber',
      qualifications: ['grundpflege', 'medikamente', 'behandlungspflege', 'insulinverabreichung'],
      maxHoursPerDay: 10,
      contact: {
        phone: '+49 152 98765432',
        email: 'michael.weber@pflege.de',
      },
      availability: {
        monday: [{ start: '14:00', end: '22:00' }],
        tuesday: [{ start: '14:00', end: '22:00' }],
        wednesday: [{ start: '14:00', end: '22:00' }],
        thursday: [{ start: '14:00', end: '22:00' }],
        friday: [{ start: '14:00', end: '22:00' }],
        saturday: [{ start: '14:00', end: '22:00' }],
        sunday: [],
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Sarah Müller',
      qualifications: ['grundpflege', 'demenzbetreuung', 'palliativpflege'],
      maxHoursPerDay: 8,
      contact: {
        phone: '+49 160 11122233',
        email: 'sarah.mueller@pflege.de',
      },
      availability: {
        monday: [{ start: '08:00', end: '16:00' }],
        tuesday: [{ start: '08:00', end: '16:00' }],
        wednesday: [{ start: '08:00', end: '16:00' }],
        thursday: [],
        friday: [{ start: '08:00', end: '16:00' }],
        saturday: [{ start: '08:00', end: '16:00' }],
        sunday: [{ start: '08:00', end: '16:00' }],
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const generateMockResidents = (): Resident[] => {
  const now = new Date().toISOString();
  
  return [
    {
      id: generateId(),
      name: 'Helga Schneider',
      dateOfBirth: '1938-05-12',
      address: {
        street: 'Hauptstraße',
        houseNumber: '45',
        zipCode: '10115',
        city: 'Berlin',
      },
      careLevel: 3,
      requirements: [
        {
          type: 'medikamente',
          frequency: 'daily',
          preferredTime: '08:00',
          duration: 15,
          requiredQualification: 'medikamente',
          notes: 'Blutdruckmittel morgens',
        },
        {
          type: 'koerperpflege',
          frequency: 'daily',
          preferredTime: '08:30',
          duration: 45,
          requiredQualification: 'grundpflege',
        },
      ],
      medicalInfo: {
        allergies: ['Penicillin'],
        medications: [
          {
            name: 'Ramipril 5mg',
            dosage: '1 Tablette',
            frequency: 'täglich',
            timeOfDay: ['08:00'],
          },
        ],
        diagnoses: ['Hypertonie', 'Diabetes Typ 2'],
        mobilityLevel: 3,
        cognitiveState: 'clear',
      },
      preferences: {
        preferredTimeSlots: [{ start: '08:00', end: '10:00' }],
      },
      contact: {
        phone: '+49 30 12345678',
        emergencyContact: {
          name: 'Maria Schneider (Tochter)',
          phone: '+49 151 99988877',
          relationship: 'Tochter',
        },
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Karl Hoffmann',
      dateOfBirth: '1935-08-23',
      address: {
        street: 'Berliner Str.',
        houseNumber: '12',
        zipCode: '10115',
        city: 'Berlin',
      },
      careLevel: 4,
      requirements: [
        {
          type: 'medikamente',
          frequency: 'daily',
          preferredTime: '08:00',
          duration: 20,
          requiredQualification: 'medikamente',
          notes: 'Insulingabe',
        },
        {
          type: 'koerperpflege',
          frequency: 'daily',
          preferredTime: '09:00',
          duration: 60,
          requiredQualification: 'grundpflege',
        },
        {
          type: 'wundversorgung',
          frequency: 'daily',
          preferredTime: '09:30',
          duration: 30,
          requiredQualification: 'wundversorgung',
          notes: 'Diabetisches Fußsyndrom',
        },
      ],
      medicalInfo: {
        allergies: [],
        medications: [
          {
            name: 'Insulin Glargin',
            dosage: '20 IE',
            frequency: 'täglich',
            timeOfDay: ['08:00', '20:00'],
          },
        ],
        diagnoses: ['Diabetes Typ 1', 'Diabetisches Fußsyndrom'],
        mobilityLevel: 4,
        cognitiveState: 'mild_impairment',
      },
      preferences: {},
      contact: {
        phone: '+49 30 98765432',
        emergencyContact: {
          name: 'Thomas Hoffmann (Sohn)',
          phone: '+49 160 55544433',
          relationship: 'Sohn',
        },
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const initializeMockData = () => {
  if (typeof window === 'undefined') return;
  
  const STORAGE_KEY = 'pflege_touren_initialized';
  const isInitialized = localStorage.getItem(STORAGE_KEY);
  
  if (!isInitialized) {
    const employees = generateMockEmployees();
    const residents = generateMockResidents();
    
    localStorage.setItem('pflege_touren_employees', JSON.stringify(employees));
    localStorage.setItem('pflege_touren_residents', JSON.stringify(residents));
    localStorage.setItem(STORAGE_KEY, 'true');
    
    console.log('✅ Mock-Daten initialisiert:', {
      employees: employees.length,
      residents: residents.length,
    });
  }
};

