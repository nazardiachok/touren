import type { Task, Tour } from '@/lib/types';
import { generateId } from '@/lib/utils/helpers';

export const generateMockTours = (
  date: string,
  employeeIds: string[],
  residentIds: string[]
): Tour[] => {
  const tours: Tour[] = [];
  const now = new Date().toISOString();

  employeeIds.forEach((employeeId, index) => {
    const residentSubset = residentIds.slice(index * 6, (index + 1) * 6);
    if (residentSubset.length === 0) return;

    const tourId = generateId();
    const tasks: Task[] = [];

    let currentTime = new Date(`${date}T06:28:00`);

    residentSubset.forEach((residentId, taskIndex) => {
      const durations = [11, 15, 25, 30, 45, 20, 35, 12];
      const duration = durations[taskIndex % durations.length];
      
      const taskTypes = ['koerperpflege', 'medikamente', 'mobilisation', 'ernaehrung'];
      const taskType = taskTypes[taskIndex % taskTypes.length];

      const notes = [
        'Strümpfe anziehen',
        'Dusche',
        'Tabletten geben',
        'Frühstück anreichen',
        'Wundversorgung',
        'Insulin spritzen',
        'Transfer Rollstuhl',
        'Anziehen',
      ];

      tasks.push({
        id: generateId(),
        tourId,
        residentId,
        type: taskType as any,
        scheduledTime: currentTime.toISOString(),
        estimatedDuration: duration,
        requiredQualification: taskType === 'medikamente' ? 'medikamente' : 'grundpflege',
        status: 'pending',
        notes: notes[taskIndex % notes.length],
        createdAt: now,
        updatedAt: now,
      });

      currentTime = new Date(currentTime.getTime() + duration * 60000 + (5 + Math.floor(Math.random() * 10)) * 60000);

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

