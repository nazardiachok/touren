import type { 
  CreateEmployeeInput, 
  CreateResidentInput, 
  CreateTaskInput, 
  CreateTourInput,
  ValidationError 
} from '@/lib/types';

export const validateEmployee = (data: CreateEmployeeInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name muss mindestens 2 Zeichen lang sein' });
  }

  if (!data.qualifications || data.qualifications.length === 0) {
    errors.push({ field: 'qualifications', message: 'Mindestens eine Qualifikation erforderlich' });
  }

  if (!data.maxHoursPerDay || data.maxHoursPerDay < 1 || data.maxHoursPerDay > 12) {
    errors.push({ field: 'maxHoursPerDay', message: 'Max. Arbeitsstunden muss zwischen 1 und 12 liegen' });
  }

  if (!data.contact.phone || !/^[+\d\s()-]+$/.test(data.contact.phone)) {
    errors.push({ field: 'contact.phone', message: 'Gültige Telefonnummer erforderlich' });
  }

  return errors;
};

export const validateResident = (data: CreateResidentInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name muss mindestens 2 Zeichen lang sein' });
  }

  if (!data.dateOfBirth) {
    errors.push({ field: 'dateOfBirth', message: 'Geburtsdatum erforderlich' });
  } else {
    const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
    if (age < 0 || age > 120) {
      errors.push({ field: 'dateOfBirth', message: 'Ungültiges Geburtsdatum' });
    }
  }

  if (!data.careLevel || data.careLevel < 1 || data.careLevel > 5) {
    errors.push({ field: 'careLevel', message: 'Pflegegrad muss zwischen 1 und 5 liegen' });
  }

  if (!data.address.street || !data.address.city || !data.address.zipCode) {
    errors.push({ field: 'address', message: 'Vollständige Adresse erforderlich' });
  }

  return errors;
};

export const validateTask = (data: CreateTaskInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.residentId) {
    errors.push({ field: 'residentId', message: 'Bewohner erforderlich' });
  }

  if (!data.scheduledTime) {
    errors.push({ field: 'scheduledTime', message: 'Zeitpunkt erforderlich' });
  }

  if (!data.estimatedDuration || data.estimatedDuration < 5 || data.estimatedDuration > 480) {
    errors.push({ field: 'estimatedDuration', message: 'Dauer muss zwischen 5 und 480 Minuten liegen' });
  }

  return errors;
};

export const validateTour = (data: CreateTourInput): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.employeeId) {
    errors.push({ field: 'employeeId', message: 'Mitarbeiter erforderlich' });
  }

  if (!data.date) {
    errors.push({ field: 'date', message: 'Datum erforderlich' });
  }

  if (!data.shift) {
    errors.push({ field: 'shift', message: 'Schicht erforderlich' });
  }

  if (!data.plannedStart || !data.plannedEnd) {
    errors.push({ field: 'time', message: 'Start- und Endzeit erforderlich' });
  } else {
    const [startH, startM] = data.plannedStart.split(':').map(Number);
    const [endH, endM] = data.plannedEnd.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes >= endMinutes) {
      errors.push({ field: 'time', message: 'Endzeit muss nach Startzeit liegen' });
    }
  }

  return errors;
};

export const isValidTime = (time: string): boolean => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

export const isValidDate = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
};

