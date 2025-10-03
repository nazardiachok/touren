import type { Task, Tour } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

export const generateMockTours = (
  date: string,
  employeeIds: string[],
  residentIds: string[]
): Tour[] => {
  const tours: Tour[] = [];
  const now = new Date().toISOString();

  const taskTypeSequence = [
    'koerperpflege',
    'medikamente', 
    'wundversorgung',
    'mobilisation',
    'ernaehrung',
    'koerperpflege',
    'medikamente',
    'dokumentation',
    'koerperpflege',
    'freizeitgestaltung',
  ];

  const notesForType = {
    koerperpflege: ['Strümpfe anziehen', 'Dusche', 'Anziehen', 'Körperpflege komplett', 'Waschen am Waschbecken'],
    medikamente: ['Tabletten geben', 'Insulin spritzen', 'Augentropfen', 'Blutdruck messen', 'Medikamente richten'],
    wundversorgung: ['Wundversorgung Fuß', 'Dekubitus versorgen', 'Verbandswechsel', 'Kompression anlegen'],
    mobilisation: ['Transfer Rollstuhl', 'Lagerung', 'Gehtraining', 'Aufstehen helfen'],
    ernaehrung: ['Frühstück anreichen', 'Essen vorbereiten', 'Trinken anreichen', 'Sondenkost'],
    dokumentation: ['Pflegedokumentation', 'Leistungsnachweis', 'Vitalwerte dokumentieren'],
    freizeitgestaltung: ['Spaziergang', 'Vorlesen', 'Gespräch', 'Gedächtnistraining'],
    arztbesuch: ['Arzttermin begleiten', 'Therapie begleiten'],
  };

  const durationsByType = {
    koerperpflege: [25, 30, 35, 40, 45, 50],
    medikamente: [10, 12, 15, 18, 20],
    wundversorgung: [20, 25, 30, 35, 40],
    mobilisation: [15, 20, 25, 30],
    ernaehrung: [20, 25, 30, 35, 40],
    dokumentation: [10, 15, 20],
    freizeitgestaltung: [30, 45, 60],
    arztbesuch: [60, 90, 120],
  };

  employeeIds.forEach((employeeId, empIndex) => {
    const residentCount = Math.min(8 + Math.floor(Math.random() * 4), residentIds.length);
    const residentSubset = residentIds.slice(empIndex * 10, empIndex * 10 + residentCount);
    
    if (residentSubset.length === 0) return;

    const tourId = generateId();
    const tasks: Task[] = [];

    const startHour = 6 + (empIndex % 3) * 0.25;
    const startMinute = 15 + (empIndex * 13) % 45;
    let currentTime = new Date(`${date}T${Math.floor(startHour).toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`);

    residentSubset.forEach((residentId, taskIndex) => {
      const taskType = taskTypeSequence[taskIndex % taskTypeSequence.length] as any;
      const possibleDurations = durationsByType[taskType] || [30];
      const duration = possibleDurations[Math.floor(Math.random() * possibleDurations.length)];
      
      const possibleNotes = notesForType[taskType] || ['Leistung'];
      const notes = possibleNotes[Math.floor(Math.random() * possibleNotes.length)];

      tasks.push({
        id: generateId(),
        tourId,
        residentId,
        type: taskType,
        scheduledTime: currentTime.toISOString(),
        estimatedDuration: duration,
        requiredQualification: taskType === 'medikamente' || taskType === 'wundversorgung' ? taskType : 'grundpflege',
        status: 'pending',
        notes,
        createdAt: now,
        updatedAt: now,
      });

      const pauseDuration = 3 + Math.floor(Math.random() * 8);
      currentTime = new Date(currentTime.getTime() + duration * 60000 + pauseDuration * 60000);

      if (currentTime.getHours() >= 14) {
        return;
      }
    });

    tours.push({
      id: tourId,
      employeeId,
      date,
      shift: 'early',
      tasks,
      status: 'planned',
      plannedStart: '06:00',
      plannedEnd: '14:00',
      createdAt: now,
      updatedAt: now,
    });
  });

  return tours;
};

export const initializeMockTours = (
  date: string,
  employeeIds: string[],
  residentIds: string[]
) => {
  if (typeof window === 'undefined') return [];
  
  const STORAGE_KEY = `pflege_touren_tours_${date}`;
  const existing = localStorage.getItem(STORAGE_KEY);
  
  if (!existing) {
    const tours = generateMockTours(date, employeeIds.slice(0, 5), residentIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
    console.log(`✅ Mock-Touren für ${date} erstellt:`, tours.length);
    return tours;
  }
  
  return JSON.parse(existing);
};

