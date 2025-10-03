import type { Employee, Resident } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

export const generateMockEmployees = (): Employee[] => {
  const now = new Date().toISOString();
  
  return [
    {
      id: generateId(),
      name: 'Anna Schmidt',
      qualifications: ['grundpflege', 'medikamente', 'wundversorgung', 'behandlungspflege', 'insulinverabreichung'],
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
      qualifications: ['grundpflege', 'medikamente', 'behandlungspflege', 'insulinverabreichung', 'wundversorgung'],
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
      qualifications: ['grundpflege', 'medikamente', 'demenzbetreuung', 'palliativpflege'],
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
    {
      id: generateId(),
      name: 'Thomas Becker',
      qualifications: ['grundpflege', 'medikamente', 'behandlungspflege', 'insulinverabreichung', 'wundversorgung', 'palliativpflege'],
      maxHoursPerDay: 9,
      contact: {
        phone: '+49 170 55566677',
        email: 'thomas.becker@pflege.de',
      },
      availability: {
        monday: [{ start: '06:00', end: '14:00' }],
        tuesday: [{ start: '06:00', end: '14:00' }],
        wednesday: [{ start: '06:00', end: '14:00' }],
        thursday: [{ start: '06:00', end: '14:00' }],
        friday: [{ start: '06:00', end: '14:00' }],
        saturday: [{ start: '06:00', end: '14:00' }],
        sunday: [],
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Julia Hoffmann',
      qualifications: ['grundpflege', 'medikamente', 'wundversorgung', 'behandlungspflege', 'demenzbetreuung'],
      maxHoursPerDay: 8,
      contact: {
        phone: '+49 151 88899900',
        email: 'julia.hoffmann@pflege.de',
      },
      availability: {
        monday: [{ start: '13:00', end: '21:00' }],
        tuesday: [{ start: '13:00', end: '21:00' }],
        wednesday: [{ start: '13:00', end: '21:00' }],
        thursday: [{ start: '13:00', end: '21:00' }],
        friday: [{ start: '13:00', end: '21:00' }],
        saturday: [],
        sunday: [{ start: '13:00', end: '21:00' }],
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Maria Schulz',
      qualifications: ['grundpflege', 'medikamente'],
      maxHoursPerDay: 8,
      contact: {
        phone: '+49 162 33344455',
        email: 'maria.schulz@pflege.de',
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
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Peter Wagner',
      qualifications: ['grundpflege'],
      maxHoursPerDay: 6,
      contact: {
        phone: '+49 171 22211100',
        email: 'peter.wagner@pflege.de',
      },
      availability: {
        monday: [{ start: '09:00', end: '15:00' }],
        tuesday: [],
        wednesday: [{ start: '09:00', end: '15:00' }],
        thursday: [],
        friday: [{ start: '09:00', end: '15:00' }],
        saturday: [{ start: '09:00', end: '15:00' }],
        sunday: [{ start: '09:00', end: '15:00' }],
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Lisa Richter',
      qualifications: ['grundpflege', 'medikamente', 'demenzbetreuung'],
      maxHoursPerDay: 8,
      contact: {
        phone: '+49 160 77788899',
        email: 'lisa.richter@pflege.de',
      },
      availability: {
        monday: [{ start: '07:30', end: '15:30' }],
        tuesday: [{ start: '07:30', end: '15:30' }],
        wednesday: [{ start: '07:30', end: '15:30' }],
        thursday: [{ start: '07:30', end: '15:30' }],
        friday: [],
        saturday: [{ start: '08:00', end: '16:00' }],
        sunday: [{ start: '08:00', end: '16:00' }],
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Stefan Klein',
      qualifications: ['grundpflege', 'medikamente', 'wundversorgung'],
      maxHoursPerDay: 9,
      contact: {
        phone: '+49 152 44455566',
        email: 'stefan.klein@pflege.de',
      },
      availability: {
        monday: [{ start: '14:30', end: '22:30' }],
        tuesday: [{ start: '14:30', end: '22:30' }],
        wednesday: [{ start: '14:30', end: '22:30' }],
        thursday: [{ start: '14:30', end: '22:30' }],
        friday: [{ start: '14:30', end: '22:30' }],
        saturday: [{ start: '14:30', end: '22:30' }],
        sunday: [],
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId(),
      name: 'Claudia Meyer',
      qualifications: ['grundpflege'],
      maxHoursPerDay: 6,
      contact: {
        phone: '+49 171 99900011',
        email: 'claudia.meyer@pflege.de',
      },
      availability: {
        monday: [],
        tuesday: [{ start: '10:00', end: '16:00' }],
        wednesday: [],
        thursday: [{ start: '10:00', end: '16:00' }],
        friday: [{ start: '10:00', end: '16:00' }],
        saturday: [{ start: '10:00', end: '16:00' }],
        sunday: [],
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
  ];
};

export const generateMockResidents = (): Resident[] => {
  const now = new Date().toISOString();
  
  const residents: Resident[] = [];

  residents.push({
    id: generateId(),
    name: 'Helga Schneider',
    dateOfBirth: '1938-05-12',
    address: { street: 'Hauptstraße', houseNumber: '45', zipCode: '10115', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:00', duration: 15, requiredQualification: 'medikamente', notes: 'Blutdruckmittel' },
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:30', duration: 45, requiredQualification: 'grundpflege' },
    ],
    medicalInfo: {
      allergies: ['Penicillin'],
      medications: [{ name: 'Ramipril 5mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] }],
      diagnoses: ['Hypertonie', 'Diabetes Typ 2'],
      mobilityLevel: 3,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '08:00', end: '10:00' }] },
    contact: { phone: '+49 30 12345678', emergencyContact: { name: 'Maria Schneider', phone: '+49 151 99988877', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Karl Hoffmann',
    dateOfBirth: '1935-08-23',
    address: { street: 'Berliner Str.', houseNumber: '12', zipCode: '10115', city: 'Berlin' },
    careLevel: 4,
    requirements: [
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:00', duration: 20, requiredQualification: 'insulinverabreichung', notes: 'Insulin spritzen' },
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '09:00', duration: 60, requiredQualification: 'grundpflege' },
      { type: 'wundversorgung', frequency: 'daily', preferredTime: '09:30', duration: 30, requiredQualification: 'wundversorgung', notes: 'Diabetisches Fußsyndrom' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [{ name: 'Insulin Glargin', dosage: '20 IE', frequency: 'täglich', timeOfDay: ['08:00', '20:00'] }],
      diagnoses: ['Diabetes Typ 1', 'Diabetisches Fußsyndrom'],
      mobilityLevel: 4,
      cognitiveState: 'mild_impairment',
    },
    preferences: {},
    contact: { phone: '+49 30 98765432', emergencyContact: { name: 'Thomas Hoffmann', phone: '+49 160 55544433', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Margarete Fischer',
    dateOfBirth: '1942-03-15',
    address: { street: 'Kastanienallee', houseNumber: '78', zipCode: '10435', city: 'Berlin' },
    careLevel: 2,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '09:00', duration: 30, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:30', duration: 10, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: ['Ibuprofen'],
      medications: [{ name: 'Metformin 850mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00', '18:00'] }],
      diagnoses: ['Diabetes Typ 2', 'Arthrose'],
      mobilityLevel: 2,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '09:00', end: '11:00' }] },
    contact: { phone: '+49 30 22334455', emergencyContact: { name: 'Klaus Fischer', phone: '+49 171 22334455', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Wilhelm Bauer',
    dateOfBirth: '1940-11-08',
    address: { street: 'Schönhauser Allee', houseNumber: '156', zipCode: '10435', city: 'Berlin' },
    careLevel: 5,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '07:30', duration: 90, requiredQualification: 'grundpflege', notes: 'Vollständige Körperpflege im Bett' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:00', duration: 15, requiredQualification: 'medikamente' },
      { type: 'ernaehrung', frequency: 'daily', preferredTime: '08:30', duration: 45, requiredQualification: 'grundpflege', notes: 'Essensgabe, Schluckstörung' },
      { type: 'wundversorgung', frequency: 'daily', preferredTime: '10:00', duration: 30, requiredQualification: 'wundversorgung', notes: 'Dekubitus Grad 2' },
    ],
    medicalInfo: {
      allergies: ['Latex'],
      medications: [
        { name: 'Morphin retard 30mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00', '20:00'] },
        { name: 'Bisoprolol 5mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] },
      ],
      diagnoses: ['Schlaganfall', 'Dekubitus', 'Dysphagie', 'Herzinsuffizienz'],
      mobilityLevel: 5,
      cognitiveState: 'moderate_impairment',
    },
    preferences: { preferredTimeSlots: [{ start: '07:00', end: '09:00' }] },
    contact: { phone: '+49 30 33445566', emergencyContact: { name: 'Anna Bauer', phone: '+49 160 33445566', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Gertrud Meyer',
    dateOfBirth: '1945-07-22',
    address: { street: 'Prenzlauer Allee', houseNumber: '234', zipCode: '10405', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:00', duration: 40, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:45', duration: 15, requiredQualification: 'medikamente' },
      { type: 'freizeitgestaltung', frequency: 'daily', preferredTime: '10:00', duration: 30, requiredQualification: 'demenzbetreuung', notes: 'Demenz, braucht Betreuung' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Donepezil 10mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] },
        { name: 'Melperon 25mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['20:00'] },
      ],
      diagnoses: ['Alzheimer-Demenz', 'Unruhe', 'Orientierungsstörung'],
      mobilityLevel: 2,
      cognitiveState: 'moderate_impairment',
    },
    preferences: { specialRequests: 'Mag klassische Musik, beruhigt sie' },
    contact: { phone: '+49 30 44556677', emergencyContact: { name: 'Peter Meyer', phone: '+49 151 44556677', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Friedrich Schulze',
    dateOfBirth: '1937-09-30',
    address: { street: 'Danziger Str.', houseNumber: '45', zipCode: '10435', city: 'Berlin' },
    careLevel: 4,
    requirements: [
      { type: 'medikamente', frequency: 'daily', preferredTime: '07:00', duration: 20, requiredQualification: 'behandlungspflege', notes: 'Antibiotika-Infusion' },
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:00', duration: 60, requiredQualification: 'grundpflege' },
      { type: 'wundversorgung', frequency: 'daily', preferredTime: '09:00', duration: 45, requiredQualification: 'wundversorgung', notes: 'Chronische Wunde am Unterschenkel' },
    ],
    medicalInfo: {
      allergies: ['Sulfonamide'],
      medications: [
        { name: 'Ceftriaxon 2g', dosage: 'i.v.', frequency: 'täglich', timeOfDay: ['07:00'] },
        { name: 'Marcumar 3mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['18:00'] },
      ],
      diagnoses: ['Chronische Wunde', 'Vorhofflimmern', 'Marcumar-Patient'],
      mobilityLevel: 3,
      cognitiveState: 'clear',
    },
    preferences: {},
    contact: { phone: '+49 30 55667788', emergencyContact: { name: 'Brigitte Schulze', phone: '+49 160 55667788', relationship: 'Ehefrau' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Elfriede Wagner',
    dateOfBirth: '1943-04-18',
    address: { street: 'Greifswalder Str.', houseNumber: '89', zipCode: '10405', city: 'Berlin' },
    careLevel: 2,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '09:30', duration: 30, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '10:00', duration: 10, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: ['Aspirin'],
      medications: [
        { name: 'Ramipril 10mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
        { name: 'Simvastatin 40mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['20:00'] },
      ],
      diagnoses: ['Hypertonie', 'Hypercholesterinämie'],
      mobilityLevel: 2,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '09:00', end: '11:00' }] },
    contact: { phone: '+49 30 66778899', emergencyContact: { name: 'Inge Wagner', phone: '+49 151 66778899', relationship: 'Schwester' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Otto Krüger',
    dateOfBirth: '1936-12-05',
    address: { street: 'Stargarder Str.', houseNumber: '12', zipCode: '10437', city: 'Berlin' },
    careLevel: 4,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:00', duration: 75, requiredQualification: 'grundpflege', notes: 'Sehr zeitintensiv' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:00', duration: 25, requiredQualification: 'insulinverabreichung', notes: 'Insulin + orale Medikamente' },
      { type: 'mobilisation', frequency: 'daily', preferredTime: '10:00', duration: 30, requiredQualification: 'grundpflege', notes: 'Transfer Bett-Rollstuhl' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'NovoRapid', dosage: '8-10-6 IE', frequency: 'täglich', timeOfDay: ['08:00', '12:00', '18:00'] },
        { name: 'L-Dopa 200mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00', '12:00', '18:00'] },
      ],
      diagnoses: ['Parkinson', 'Diabetes Typ 2', 'Immobilität'],
      mobilityLevel: 4,
      cognitiveState: 'mild_impairment',
    },
    preferences: {},
    contact: { phone: '+49 30 77889900', emergencyContact: { name: 'Herbert Krüger', phone: '+49 171 77889900', relationship: 'Bruder' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Emma Richter',
    dateOfBirth: '1941-06-11',
    address: { street: 'Kollwitzstr.', houseNumber: '67', zipCode: '10435', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:30', duration: 45, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:00', duration: 15, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: ['Nüsse', 'Erdbeeren'],
      medications: [
        { name: 'Torasemid 10mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] },
        { name: 'Digoxin 0,25mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] },
      ],
      diagnoses: ['Herzinsuffizienz', 'Ödeme'],
      mobilityLevel: 3,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '08:00', end: '10:00' }] },
    contact: { phone: '+49 30 88990011', emergencyContact: { name: 'Sabine Richter', phone: '+49 160 88990011', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Heinrich Vogel',
    dateOfBirth: '1939-01-27',
    address: { street: 'Rykestr.', houseNumber: '34', zipCode: '10405', city: 'Berlin' },
    careLevel: 5,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '07:00', duration: 90, requiredQualification: 'grundpflege', notes: 'Komplett pflegebedürftig' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:00', duration: 20, requiredQualification: 'behandlungspflege', notes: 'PEG-Sonde' },
      { type: 'ernaehrung', frequency: 'daily', preferredTime: '08:30', duration: 30, requiredQualification: 'behandlungspflege', notes: 'Sondennahrung' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Levetiracetam 1000mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00', '20:00'] },
      ],
      diagnoses: ['Schlaganfall mit schwerer Behinderung', 'PEG-Sonde', 'Epilepsie'],
      mobilityLevel: 5,
      cognitiveState: 'severe_impairment',
    },
    preferences: {},
    contact: { phone: '+49 30 99001122', emergencyContact: { name: 'Michael Vogel', phone: '+49 151 99001122', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Irmgard Klein',
    dateOfBirth: '1944-08-14',
    address: { street: 'Husemannstr.', houseNumber: '23', zipCode: '10435', city: 'Berlin' },
    careLevel: 2,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '10:00', duration: 35, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '10:30', duration: 10, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Levothyroxin 100µg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] },
        { name: 'Calcium 500mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['12:00'] },
      ],
      diagnoses: ['Hypothyreose', 'Osteoporose'],
      mobilityLevel: 2,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '10:00', end: '12:00' }] },
    contact: { phone: '+49 30 11223344', emergencyContact: { name: 'Stefan Klein', phone: '+49 171 11223344', relationship: 'Neffe' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Walter Schmidt',
    dateOfBirth: '1938-10-09',
    address: { street: 'Lychener Str.', houseNumber: '56', zipCode: '10437', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '09:00', duration: 50, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:00', duration: 15, requiredQualification: 'insulinverabreichung' },
      { type: 'freizeitgestaltung', frequency: 'daily', preferredTime: '11:00', duration: 30, requiredQualification: 'demenzbetreuung', notes: 'Verwirrtheit' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Insulin Lantus', dosage: '18 IE', frequency: 'täglich', timeOfDay: ['09:00', '21:00'] },
        { name: 'Risperidon 1mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['20:00'] },
      ],
      diagnoses: ['Diabetes Typ 2', 'Vaskuläre Demenz', 'Agitation'],
      mobilityLevel: 2,
      cognitiveState: 'moderate_impairment',
    },
    preferences: {},
    contact: { phone: '+49 30 22334455', emergencyContact: { name: 'Karin Schmidt', phone: '+49 160 22334455', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Anna Hoffmann',
    dateOfBirth: '1946-02-28',
    address: { street: 'Eberswalder Str.', houseNumber: '78', zipCode: '10437', city: 'Berlin' },
    careLevel: 1,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '11:00', duration: 25, requiredQualification: 'grundpflege', notes: 'Nur Duschen, sonst selbstständig' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '11:30', duration: 10, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'ASS 100mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['11:00'] },
      ],
      diagnoses: ['Z.n. Myokardinfarkt', 'Leichte Herzinsuffizienz'],
      mobilityLevel: 1,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '11:00', end: '12:00' }] },
    contact: { phone: '+49 30 33445566', emergencyContact: { name: 'Lisa Hoffmann', phone: '+49 151 33445566', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Kurt Becker',
    dateOfBirth: '1935-05-20',
    address: { street: 'Pappelallee', houseNumber: '12', zipCode: '10437', city: 'Berlin' },
    careLevel: 4,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '07:30', duration: 70, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:30', duration: 20, requiredQualification: 'medikamente' },
      { type: 'wundversorgung', frequency: 'daily', preferredTime: '09:00', duration: 40, requiredQualification: 'wundversorgung', notes: 'Druckgeschwür Ferse' },
    ],
    medicalInfo: {
      allergies: ['Jod'],
      medications: [
        { name: 'Apixaban 5mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00', '20:00'] },
        { name: 'Metoprolol 50mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] },
      ],
      diagnoses: ['Vorhofflimmern', 'Dekubitus Ferse', 'Immobilität'],
      mobilityLevel: 4,
      cognitiveState: 'clear',
    },
    preferences: {},
    contact: { phone: '+49 30 44556677', emergencyContact: { name: 'Julia Becker', phone: '+49 160 44556677', relationship: 'Enkelin' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Rosa Müller',
    dateOfBirth: '1942-11-03',
    address: { street: 'Raumerstr.', houseNumber: '89', zipCode: '10437', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:30', duration: 45, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:15', duration: 15, requiredQualification: 'medikamente' },
      { type: 'mobilisation', frequency: 'daily', preferredTime: '10:00', duration: 20, requiredQualification: 'grundpflege' },
    ],
    medicalInfo: {
      allergies: ['Kontrastmittel'],
      medications: [
        { name: 'Metformin 1000mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00', '19:00'] },
        { name: 'Atorvastatin 20mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['20:00'] },
      ],
      diagnoses: ['Diabetes Typ 2', 'Hypercholesterinämie', 'Polyneuropathie'],
      mobilityLevel: 3,
      cognitiveState: 'clear',
    },
    preferences: {},
    contact: { phone: '+49 30 55667788', emergencyContact: { name: 'Martin Müller', phone: '+49 171 55667788', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Paul Weber',
    dateOfBirth: '1940-07-16',
    address: { street: 'Schivelbeiner Str.', houseNumber: '45', zipCode: '10439', city: 'Berlin' },
    careLevel: 5,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '07:00', duration: 90, requiredQualification: 'grundpflege', notes: 'Komplett bettlägerig' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:00', duration: 20, requiredQualification: 'palliativpflege', notes: 'Schmerzpumpe kontrollieren' },
      { type: 'wundversorgung', frequency: 'daily', preferredTime: '09:00', duration: 40, requiredQualification: 'wundversorgung', notes: 'Dekubitus Grad 3 Sakral' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Fentanyl-Pflaster 75µg', dosage: 'alle 3 Tage', frequency: 'täglich', timeOfDay: [] },
        { name: 'Morphin Tropfen', dosage: 'nach Bedarf', frequency: 'täglich', timeOfDay: [] },
      ],
      diagnoses: ['Metastasiertes Prostatakarzinom', 'Dekubitus Grad 3', 'Palliativsituation'],
      mobilityLevel: 5,
      cognitiveState: 'mild_impairment',
    },
    preferences: { specialRequests: 'Palliative Versorgung, Schmerzmanagement prioritär' },
    contact: { phone: '+49 30 66778899', emergencyContact: { name: 'Petra Weber', phone: '+49 160 66778899', relationship: 'Ehefrau' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Elisabeth Braun',
    dateOfBirth: '1943-09-12',
    address: { street: 'Bornholmer Str.', houseNumber: '123', zipCode: '10439', city: 'Berlin' },
    careLevel: 2,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '09:30', duration: 30, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '10:00', duration: 10, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Pantoprazol 40mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] },
        { name: 'Ibuprofen 400mg', dosage: 'bei Bedarf', frequency: 'täglich', timeOfDay: [] },
      ],
      diagnoses: ['Refluxösophagitis', 'Gonarthrose'],
      mobilityLevel: 2,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '09:00', end: '11:00' }] },
    contact: { phone: '+49 30 77889900', emergencyContact: { name: 'Frank Braun', phone: '+49 151 77889900', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Hans Neumann',
    dateOfBirth: '1937-04-25',
    address: { street: 'Wisbyer Str.', houseNumber: '67', zipCode: '10439', city: 'Berlin' },
    careLevel: 4,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:00', duration: 65, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:00', duration: 20, requiredQualification: 'insulinverabreichung' },
      { type: 'mobilisation', frequency: 'daily', preferredTime: '09:30', duration: 30, requiredQualification: 'grundpflege', notes: 'Sturz prophylaxe' },
    ],
    medicalInfo: {
      allergies: ['Codein'],
      medications: [
        { name: 'Insulin Humalog', dosage: '10-8-8 IE', frequency: 'täglich', timeOfDay: ['08:00', '12:00', '18:00'] },
        { name: 'Rivaroxaban 20mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['12:00'] },
      ],
      diagnoses: ['Diabetes Typ 1', 'Vorhofflimmern', 'Sturzgefahr'],
      mobilityLevel: 3,
      cognitiveState: 'mild_impairment',
    },
    preferences: {},
    contact: { phone: '+49 30 88990011', emergencyContact: { name: 'Helga Neumann', phone: '+49 160 88990011', relationship: 'Ehefrau' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Luise Schröder',
    dateOfBirth: '1944-12-30',
    address: { street: 'Björnsonstr.', houseNumber: '34', zipCode: '10439', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:30', duration: 45, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:15', duration: 15, requiredQualification: 'medikamente' },
      { type: 'freizeitgestaltung', frequency: 'daily', preferredTime: '10:30', duration: 30, requiredQualification: 'demenzbetreuung' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Memantin 20mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
        { name: 'Quetiapin 25mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['20:00'] },
      ],
      diagnoses: ['Lewy-Body-Demenz', 'Halluzinationen', 'Sturzneigung'],
      mobilityLevel: 3,
      cognitiveState: 'moderate_impairment',
    },
    preferences: { specialRequests: 'Keine lauten Geräusche, wird unruhig' },
    contact: { phone: '+49 30 99001122', emergencyContact: { name: 'Sabine Schröder', phone: '+49 171 99001122', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Erich Koch',
    dateOfBirth: '1936-06-08',
    address: { street: 'Kuglerstr.', houseNumber: '56', zipCode: '10439', city: 'Berlin' },
    careLevel: 5,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '07:30', duration: 85, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:30', duration: 20, requiredQualification: 'behandlungspflege' },
      { type: 'ernaehrung', frequency: 'daily', preferredTime: '09:00', duration: 45, requiredQualification: 'grundpflege', notes: 'Aspirationsgefahr' },
      { type: 'wundversorgung', frequency: 'daily', preferredTime: '10:00', duration: 35, requiredQualification: 'wundversorgung' },
    ],
    medicalInfo: {
      allergies: ['Morphin'],
      medications: [
        { name: 'Levodopa 200mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00', '14:00', '20:00'] },
        { name: 'Oxycodon 10mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00', '20:00'] },
      ],
      diagnoses: ['Parkinson fortgeschritten', 'Dysphagie', 'Dekubitus', 'Kontrakturen'],
      mobilityLevel: 5,
      cognitiveState: 'moderate_impairment',
    },
    preferences: {},
    contact: { phone: '+49 30 11223344', emergencyContact: { name: 'Thomas Koch', phone: '+49 160 11223344', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Martha Zimmermann',
    dateOfBirth: '1945-01-19',
    address: { street: 'Malmöer Str.', houseNumber: '78', zipCode: '10439', city: 'Berlin' },
    careLevel: 2,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '10:00', duration: 35, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '10:30', duration: 10, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Bisoprolol 2,5mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['10:00'] },
        { name: 'Vitamin D 1000 IE', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['10:00'] },
      ],
      diagnoses: ['Arterielle Hypertonie', 'Vitamin-D-Mangel'],
      mobilityLevel: 2,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '10:00', end: '12:00' }] },
    contact: { phone: '+49 30 22334455', emergencyContact: { name: 'Robert Zimmermann', phone: '+49 151 22334455', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Herbert Lang',
    dateOfBirth: '1938-08-07',
    address: { street: 'Osloer Str.', houseNumber: '90', zipCode: '13359', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '09:00', duration: 50, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:45', duration: 15, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Tamsulosin 0,4mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
        { name: 'Finasterid 5mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
      ],
      diagnoses: ['Benigne Prostatahyperplasie', 'Harnverhalt-Risiko'],
      mobilityLevel: 2,
      cognitiveState: 'clear',
    },
    preferences: {},
    contact: { phone: '+49 30 33445566', emergencyContact: { name: 'Claudia Lang', phone: '+49 160 33445566', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Hildegard Schneider',
    dateOfBirth: '1941-10-22',
    address: { street: 'Torfstr.', houseNumber: '23', zipCode: '13353', city: 'Berlin' },
    careLevel: 4,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:00', duration: 70, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:00', duration: 20, requiredQualification: 'medikamente' },
      { type: 'mobilisation', frequency: 'daily', preferredTime: '10:00', duration: 30, requiredQualification: 'grundpflege', notes: 'Kontrakturprophylaxe' },
    ],
    medicalInfo: {
      allergies: ['Pflaster'],
      medications: [
        { name: 'Amlodipin 10mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
        { name: 'Furosemid 40mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
      ],
      diagnoses: ['Herzinsuffizienz NYHA III', 'Ödeme', 'Immobilität'],
      mobilityLevel: 4,
      cognitiveState: 'clear',
    },
    preferences: {},
    contact: { phone: '+49 30 44556677', emergencyContact: { name: 'Wolfgang Schneider', phone: '+49 171 44556677', relationship: 'Bruder' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Günter Vogel',
    dateOfBirth: '1943-03-14',
    address: { street: 'Reinickendorfer Str.', houseNumber: '67', zipCode: '13347', city: 'Berlin' },
    careLevel: 2,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '09:30', duration: 30, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '10:00', duration: 10, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Allopurinol 300mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['10:00'] },
      ],
      diagnoses: ['Chronische Gicht', 'Hyperurikämie'],
      mobilityLevel: 2,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '09:00', end: '11:00' }] },
    contact: { phone: '+49 30 55667788', emergencyContact: { name: 'Andrea Vogel', phone: '+49 160 55667788', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Frieda Krause',
    dateOfBirth: '1940-05-29',
    address: { street: 'Badstr.', houseNumber: '45', zipCode: '13357', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:30', duration: 45, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:15', duration: 15, requiredQualification: 'medikamente' },
      { type: 'freizeitgestaltung', frequency: 'daily', preferredTime: '10:30', duration: 30, requiredQualification: 'demenzbetreuung', notes: 'Frontotemporale Demenz' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Sertralin 50mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
        { name: 'Lorazepam 0,5mg', dosage: 'bei Bedarf', frequency: 'täglich', timeOfDay: [] },
      ],
      diagnoses: ['Frontotemporale Demenz', 'Depression', 'Angststörung'],
      mobilityLevel: 2,
      cognitiveState: 'moderate_impairment',
    },
    preferences: { specialRequests: 'Benötigt viel Zuwendung, ängstlich' },
    contact: { phone: '+49 30 66778899', emergencyContact: { name: 'Michael Krause', phone: '+49 151 66778899', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Alfred Lehmann',
    dateOfBirth: '1937-11-11',
    address: { street: 'Soldiner Str.', houseNumber: '89', zipCode: '13359', city: 'Berlin' },
    careLevel: 4,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '07:30', duration: 65, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '08:30', duration: 20, requiredQualification: 'behandlungspflege', notes: 'Inhalation' },
      { type: 'mobilisation', frequency: 'daily', preferredTime: '09:30', duration: 25, requiredQualification: 'grundpflege' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Spiriva 18µg', dosage: '1 Inhalation', frequency: 'täglich', timeOfDay: ['08:00'] },
        { name: 'Salbutamol', dosage: 'bei Bedarf', frequency: 'täglich', timeOfDay: [] },
        { name: 'Prednisolon 10mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] },
      ],
      diagnoses: ['COPD Gold IV', 'Chronische respiratorische Insuffizienz', 'Immobilität'],
      mobilityLevel: 4,
      cognitiveState: 'clear',
    },
    preferences: {},
    contact: { phone: '+49 30 77889900', emergencyContact: { name: 'Ingrid Lehmann', phone: '+49 160 77889900', relationship: 'Ehefrau' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Herta Jung',
    dateOfBirth: '1944-07-05',
    address: { street: 'Bristolstr.', houseNumber: '12', zipCode: '13349', city: 'Berlin' },
    careLevel: 2,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '10:30', duration: 30, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '11:00', duration: 10, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Euthyrox 75µg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['08:00'] },
        { name: 'Vitamin B12 1000µg', dosage: '1 Tablette', frequency: 'wöchentlich', timeOfDay: ['11:00'] },
      ],
      diagnoses: ['Hypothyreose', 'Vitamin-B12-Mangel', 'Polyneuropathie'],
      mobilityLevel: 2,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '10:00', end: '12:00' }] },
    contact: { phone: '+49 30 88990011', emergencyContact: { name: 'Peter Jung', phone: '+49 171 88990011', relationship: 'Neffe' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Ernst Fischer',
    dateOfBirth: '1939-09-18',
    address: { street: 'Utrechter Str.', houseNumber: '56', zipCode: '13347', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:45', duration: 50, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:30', duration: 15, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: ['Sulfonamide'],
      medications: [
        { name: 'Clopidogrel 75mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
        { name: 'Ramipril 5mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
      ],
      diagnoses: ['Z.n. Schlaganfall', 'Hemiparese rechts', 'Hypertonie'],
      mobilityLevel: 3,
      cognitiveState: 'mild_impairment',
    },
    preferences: {},
    contact: { phone: '+49 30 99001122', emergencyContact: { name: 'Monika Fischer', phone: '+49 160 99001122', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Käthe Werner',
    dateOfBirth: '1946-04-02',
    address: { street: 'Limburger Str.', houseNumber: '34', zipCode: '13355', city: 'Berlin' },
    careLevel: 1,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '11:30', duration: 25, requiredQualification: 'grundpflege', notes: 'Nur Unterstützung Duschen' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '12:00', duration: 10, requiredQualification: 'medikamente' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Metoprolol 25mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['12:00'] },
      ],
      diagnoses: ['Leichte Herzinsuffizienz', 'Hypertonie'],
      mobilityLevel: 1,
      cognitiveState: 'clear',
    },
    preferences: { preferredTimeSlots: [{ start: '11:00', end: '13:00' }] },
    contact: { phone: '+49 30 11223344', emergencyContact: { name: 'Sophie Werner', phone: '+49 151 11223344', relationship: 'Tochter' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Bruno Hartmann',
    dateOfBirth: '1938-12-24',
    address: { street: 'Togostr.', houseNumber: '78', zipCode: '13351', city: 'Berlin' },
    careLevel: 4,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '08:00', duration: 70, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:00', duration: 25, requiredQualification: 'behandlungspflege', notes: 'Katheter-Pflege' },
      { type: 'wundversorgung', frequency: 'daily', preferredTime: '09:30', duration: 30, requiredQualification: 'wundversorgung', notes: 'Stomaversorgung' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Tamsulosin 0,4mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
        { name: 'Ciprofloxacin 500mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00', '21:00'] },
      ],
      diagnoses: ['Z.n. Prostatektomie', 'Dauerkatheter', 'Rezidivierende Harnwegsinfekte', 'Stoma'],
      mobilityLevel: 3,
      cognitiveState: 'clear',
    },
    preferences: {},
    contact: { phone: '+49 30 22334455', emergencyContact: { name: 'Christa Hartmann', phone: '+49 160 22334455', relationship: 'Ehefrau' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  residents.push({
    id: generateId(),
    name: 'Else König',
    dateOfBirth: '1942-06-30',
    address: { street: 'Afrikanische Str.', houseNumber: '145', zipCode: '13351', city: 'Berlin' },
    careLevel: 3,
    requirements: [
      { type: 'koerperpflege', frequency: 'daily', preferredTime: '09:00', duration: 45, requiredQualification: 'grundpflege' },
      { type: 'medikamente', frequency: 'daily', preferredTime: '09:45', duration: 15, requiredQualification: 'medikamente' },
      { type: 'freizeitgestaltung', frequency: 'daily', preferredTime: '11:00', duration: 30, requiredQualification: 'demenzbetreuung', notes: 'Gedächtnistraining' },
    ],
    medicalInfo: {
      allergies: [],
      medications: [
        { name: 'Donepezil 10mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['09:00'] },
        { name: 'Mirtazapin 15mg', dosage: '1 Tablette', frequency: 'täglich', timeOfDay: ['20:00'] },
      ],
      diagnoses: ['Alzheimer-Demenz Stadium 2', 'Depression', 'Schlafstörung'],
      mobilityLevel: 2,
      cognitiveState: 'moderate_impairment',
    },
    preferences: { specialRequests: 'Mag Gartenarbeit und Singen' },
    contact: { phone: '+49 30 33445566', emergencyContact: { name: 'Dieter König', phone: '+49 171 33445566', relationship: 'Sohn' } },
    status: 'active',
    createdAt: now,
    updatedAt: now,
  });

  return residents;
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

