import type { CreateTaskInput, CreateTourInput, Task, Tour } from '@/lib/types';

/**
 * Function Definitions für GPT-5 Function Calling
 */
export const AGENT_FUNCTIONS = [
  {
    type: 'function',
    function: {
      name: 'createTour',
      description: 'Erstellt eine neue Tour für einen Mitarbeiter an einem bestimmten Datum',
      parameters: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            description: 'Die ID des Mitarbeiters, der die Tour durchführt',
          },
          date: {
            type: 'string',
            description: 'Das Datum der Tour im Format YYYY-MM-DD',
          },
          shift: {
            type: 'string',
            enum: ['early', 'late', 'night'],
            description: 'Die Schicht: early (06:00-14:00), late (14:00-22:00), night (22:00-06:00)',
          },
          plannedStart: {
            type: 'string',
            description: 'Geplante Startzeit im Format HH:MM',
          },
          plannedEnd: {
            type: 'string',
            description: 'Geplante Endzeit im Format HH:MM',
          },
        },
        required: ['employeeId', 'date', 'shift', 'plannedStart', 'plannedEnd'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'addTaskToTour',
      description: 'Fügt einen Pflege-Einsatz zu einer bestehenden Tour hinzu',
      parameters: {
        type: 'object',
        properties: {
          tourId: {
            type: 'string',
            description: 'Die ID der Tour, zu der der Einsatz hinzugefügt werden soll',
          },
          residentId: {
            type: 'string',
            description: 'Die ID des Bewohners, der besucht wird. Verwende "driving" für Fahrtzeiten',
          },
          type: {
            type: 'string',
            enum: ['koerperpflege', 'behandlungspflege', 'medikamente', 'grundpflege', 'hauswirtschaft', 'betreuung', 'dokumentation'],
            description: 'Art der Pflegeleistung',
          },
          scheduledTime: {
            type: 'string',
            description: 'Geplante Startzeit als ISO-String (z.B. 2025-10-04T06:30:00.000Z)',
          },
          estimatedDuration: {
            type: 'number',
            description: 'Geschätzte Dauer in Minuten',
          },
          notes: {
            type: 'string',
            description: 'Optional: Zusätzliche Notizen zum Einsatz',
          },
        },
        required: ['tourId', 'residentId', 'type', 'scheduledTime', 'estimatedDuration'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'updateTask',
      description: 'Aktualisiert einen bestehenden Einsatz (z.B. Zeit ändern, Dauer anpassen)',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'Die ID des zu ändernden Einsatzes',
          },
          scheduledTime: {
            type: 'string',
            description: 'Optional: Neue Startzeit als ISO-String',
          },
          estimatedDuration: {
            type: 'number',
            description: 'Optional: Neue Dauer in Minuten',
          },
          notes: {
            type: 'string',
            description: 'Optional: Aktualisierte Notizen',
          },
        },
        required: ['taskId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'deleteTask',
      description: 'Löscht einen Einsatz aus einer Tour',
      parameters: {
        type: 'object',
        properties: {
          taskId: {
            type: 'string',
            description: 'Die ID des zu löschenden Einsatzes',
          },
        },
        required: ['taskId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'deleteTour',
      description: 'Löscht eine komplette Tour mit allen Einsätzen',
      parameters: {
        type: 'object',
        properties: {
          tourId: {
            type: 'string',
            description: 'Die ID der zu löschenden Tour',
          },
        },
        required: ['tourId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getTourInfo',
      description: 'Ruft Details zu einer Tour ab',
      parameters: {
        type: 'object',
        properties: {
          tourId: {
            type: 'string',
            description: 'Die ID der Tour',
          },
        },
        required: ['tourId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getToursForDate',
      description: 'Ruft alle Touren für ein bestimmtes Datum ab',
      parameters: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Das Datum im Format YYYY-MM-DD',
          },
        },
        required: ['date'],
      },
    },
  },
];

/**
 * Function Handler - Führt die aufgerufenen Funktionen aus
 */
export async function executeFunctionCall(
  functionName: string,
  args: any,
  context: { tours: Tour[]; addTour: (input: CreateTourInput) => Tour; addTask: (input: CreateTaskInput) => Task; updateTask: (id: string, updates: Partial<Task>) => void; deleteTask: (id: string) => void; deleteTour: (id: string) => void }
): Promise<{ success: boolean; result?: any; error?: string }> {
  try {
    console.log(`🔧 Executing function: ${functionName}`, args);

    switch (functionName) {
      case 'createTour': {
        const { employeeId, date, shift, plannedStart, plannedEnd } = args;
        const tourInput: CreateTourInput = {
          employeeId,
          date,
          shift,
          plannedStart,
          plannedEnd,
          tasks: [],
        };
        const newTour = context.addTour(tourInput);
        return {
          success: true,
          result: {
            tourId: newTour.id,
            message: `Tour erstellt für Mitarbeiter ${employeeId} am ${date}, Schicht: ${shift}`,
          },
        };
      }

      case 'addTaskToTour': {
        const { tourId, residentId, type, scheduledTime, estimatedDuration, notes } = args;
        
        const tour = context.tours.find(t => t.id === tourId);
        if (!tour) {
          return { success: false, error: `Tour ${tourId} nicht gefunden` };
        }

        const taskInput: CreateTaskInput = {
          tourId,
          residentId,
          type,
          scheduledTime,
          estimatedDuration,
          requiredQualification: type === 'behandlungspflege' ? 'behandlungspflege' : 'grundpflege',
          notes: notes || '',
        };

        const newTask = context.addTask(taskInput);
        return {
          success: true,
          result: {
            taskId: newTask.id,
            message: `Einsatz hinzugefügt: ${residentId === 'driving' ? 'Fahrtzeit' : `Bewohner ${residentId}`} (${type}, ${estimatedDuration}min)`,
          },
        };
      }

      case 'updateTask': {
        const { taskId, ...updates } = args;
        context.updateTask(taskId, updates);
        return {
          success: true,
          result: { message: `Einsatz ${taskId} aktualisiert` },
        };
      }

      case 'deleteTask': {
        const { taskId } = args;
        context.deleteTask(taskId);
        return {
          success: true,
          result: { message: `Einsatz ${taskId} gelöscht` },
        };
      }

      case 'deleteTour': {
        const { tourId } = args;
        context.deleteTour(tourId);
        return {
          success: true,
          result: { message: `Tour ${tourId} gelöscht` },
        };
      }

      case 'getTourInfo': {
        const { tourId } = args;
        const tour = context.tours.find(t => t.id === tourId);
        if (!tour) {
          return { success: false, error: `Tour ${tourId} nicht gefunden` };
        }
        return {
          success: true,
          result: {
            tour: {
              id: tour.id,
              employeeId: tour.employeeId,
              date: tour.date,
              shift: tour.shift,
              tasksCount: tour.tasks.length,
              plannedStart: tour.plannedStart,
              plannedEnd: tour.plannedEnd,
            },
          },
        };
      }

      case 'getToursForDate': {
        const { date } = args;
        const tours = context.tours.filter(t => t.date === date);
        return {
          success: true,
          result: {
            count: tours.length,
            tours: tours.map(t => ({
              id: t.id,
              employeeId: t.employeeId,
              shift: t.shift,
              tasksCount: t.tasks.length,
            })),
          },
        };
      }

      default:
        return { success: false, error: `Unbekannte Funktion: ${functionName}` };
    }
  } catch (error) {
    console.error(`❌ Function execution error:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }
}

