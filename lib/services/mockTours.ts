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

const addDrivingTimeTask = (
  tourId: string,
  prevTaskEnd: Date,
  durationMinutes: number,
  now: string
): Task => {
  return {
    id: generateId(),
    tourId,
    residentId: 'driving',
    type: 'dokumentation' as any,
    scheduledTime: prevTaskEnd.toISOString(),
    estimatedDuration: durationMinutes,
    requiredQualification: 'grundpflege',
    status: 'pending',
    notes: 'Fahrtzeit',
    createdAt: now,
    updatedAt: now,
  };
};

export const generateMockToursForWeek = (
  startDate: string,
  employeeIds: string[],
  residentIds: string[]
): Tour[] => {
  const tours: Tour[] = [];
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTours = generateMockTours(dateStr, employeeIds, residentIds);
    
    dayTours.forEach(tour => {
      const newTasks: Task[] = [];
      const shouldHaveGaps = Math.random() > 0.6;
      
      tour.tasks.forEach((task, index) => {
        newTasks.push(task);
        
        if (index < tour.tasks.length - 1) {
          const currentTaskEnd = new Date(new Date(task.scheduledTime).getTime() + task.estimatedDuration * 60000);
          const drivingMinutes = 5 + Math.floor(Math.random() * 6);
          
          newTasks.push(addDrivingTimeTask(tour.id, currentTaskEnd, drivingMinutes, tour.createdAt));
        }
      });
      
      if (shouldHaveGaps && newTasks.length > 4) {
        const removeCount = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < removeCount; i++) {
          const randomIndex = Math.floor(Math.random() * newTasks.length);
          newTasks.splice(randomIndex, 1);
        }
      }
      
      tours.push({
        ...tour,
        tasks: newTasks,
      });
    });
  }
  
  return tours;
};

export const initializeMockTours = (
  date: string,
  employeeIds: string[],
  residentIds: string[]
) => {
  if (typeof window === 'undefined') return [];
  
  const STORAGE_KEY = 'pflege_touren_tours_week';
  const existing = localStorage.getItem(STORAGE_KEY);
  
  if (!existing) {
    const tours = generateMockToursForWeek(date, employeeIds.slice(0, 5), residentIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tours));
    localStorage.setItem('pflege_touren_tours', JSON.stringify(tours));
    console.log(`✅ Mock-Touren für Woche erstellt:`, tours.length);
    return tours;
  }
  
  return JSON.parse(existing);
};

