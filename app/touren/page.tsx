'use client';

import { AIChat } from '@/components/AIChat';
import { PlanningProgress, type PlanningStep } from '@/components/PlanningProgress';
import { preparePlanningContext } from '@/lib/services/aiPlanning';
import { initializeMockTours } from '@/lib/services/mockTours';
import { useEmployeeStore } from '@/lib/store/employeeStore';
import { useResidentStore } from '@/lib/store/residentStore';
import { useTourStore } from '@/lib/store/tourStore';
import type { Resident, Task, TaskType } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Edit2, Home, Save, Sparkles, Trash2, User as UserIcon, Users, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const TIMELINE_START = 6;
const TIMELINE_END = 22; 
const PIXELS_PER_HOUR = 120;

const getTaskColor = (taskType: TaskType, isDriving: boolean = false): { bg: string; border: string; text: string; badge: string } => {
  if (isDriving) {
    return {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-900',
      badge: 'bg-green-200 text-green-800',
    };
  }

  const colors = {
    koerperpflege: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-900', badge: 'bg-blue-200 text-blue-800' },
    medikamente: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-900', badge: 'bg-red-200 text-red-800' },
    wundversorgung: { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-900', badge: 'bg-orange-200 text-orange-800' },
    mobilisation: { bg: 'bg-teal-100', border: 'border-teal-400', text: 'text-teal-900', badge: 'bg-teal-200 text-teal-800' },
    ernaehrung: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-900', badge: 'bg-yellow-200 text-yellow-800' },
    dokumentation: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-900', badge: 'bg-gray-200 text-gray-800' },
    arztbesuch: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-900', badge: 'bg-purple-200 text-purple-800' },
    freizeitgestaltung: { bg: 'bg-pink-100', border: 'border-pink-400', text: 'text-pink-900', badge: 'bg-pink-200 text-pink-800' },
  };

  return colors[taskType] || colors.koerperpflege;
};

const getMinutesSinceMidnight = (time: Date | string) => {
  const date = typeof time === 'string' ? new Date(time) : time;
  return date.getHours() * 60 + date.getMinutes();
};

const getPixelsFromTop = (time: Date | string) => {
  const minutes = getMinutesSinceMidnight(time);
  const timelineStartMinutes = TIMELINE_START * 60;
  const minutesFromStart = minutes - timelineStartMinutes;
  return (minutesFromStart / 60) * PIXELS_PER_HOUR;
};

const getHeightInPixels = (durationMinutes: number) => {
  return (durationMinutes / 60) * PIXELS_PER_HOUR;
};

type FreeSlot = {
  start: Date;
  end: Date;
  topPx: number;
  heightPx: number;
};

export default function TourenPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [draggedResident, setDraggedResident] = useState<Resident | null>(null);
  const [draggedTask, setDraggedTask] = useState<{ task: Task; tourId: string; employeeId: string } | null>(null);
  const [dragPosition, setDragPosition] = useState<{ y: number; minutes: number } | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<{ task: Task; tourId: string } | null>(null);
  
  // KI-Planning State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ reasoning: string; warnings?: string[] } | null>(null);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [planningSteps, setPlanningSteps] = useState<PlanningStep[]>([]);
  const [showPlanningProgress, setShowPlanningProgress] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    residentId: '',
    startTime: '08:00',
    duration: 30,
    taskType: 'koerperpflege' as TaskType,
    notes: '',
  });

  const employees = useEmployeeStore(state => state.employees);
  const loadEmployees = useEmployeeStore(state => state.loadEmployees);
  
  const residents = useResidentStore(state => state.residents);
  const loadResidents = useResidentStore(state => state.loadResidents);
  
  const tours = useTourStore(state => state.tours);
  const loadTours = useTourStore(state => state.loadTours);
  const addTour = useTourStore(state => state.addTour);
  const updateTour = useTourStore(state => state.updateTour);
  const addTask = useTourStore(state => state.addTask);
  const updateTask = useTourStore(state => state.updateTask);
  const deleteTask = useTourStore(state => state.deleteTask);

  useEffect(() => {
    setMounted(true);
    loadEmployees();
    loadResidents();
    loadTours();
  }, [loadEmployees, loadResidents, loadTours]);

  useEffect(() => {
    if (employees.length > 0 && residents.length > 0 && mounted) {
      const dateStr = formatDate(selectedDate, 'yyyy-MM-dd');
      const mockTours = initializeMockTours(
        dateStr,
        employees.map(e => e.id),
        residents.map(r => r.id)
      );
      
      if (mockTours.length > 0) {
        loadTours();
      }
    }
  }, [employees.length, residents.length, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const dateStr = formatDate(selectedDate, 'yyyy-MM-dd');
  const dayTours = tours.filter(t => t.date === dateStr);
  const activeEmployees = employees.filter(e => e.status === 'active').slice(0, 5);
  const activeResidents = residents.filter(r => r.status === 'active');

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => setSelectedDate(new Date());

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} Min.`;
    if (mins === 0) return `${hours} Std.`;
    return `${hours}:${mins.toString().padStart(2, '0')} Std.`;
  };

  const getTotalStatsForEmployee = (employeeId: string) => {
    const employeeTours = dayTours.filter(t => t.employeeId === employeeId);
    const allTasks = employeeTours.flatMap(t => t.tasks).filter(t => t.residentId !== 'driving');
    const totalMinutes = allTasks.reduce((sum, task) => sum + task.estimatedDuration, 0);
    
    return { tasks: allTasks.length, duration: totalMinutes };
  };

  const getTasksForEmployee = (employeeId: string) => {
    const employeeTours = dayTours.filter(t => t.employeeId === employeeId);
    return employeeTours.flatMap(tour => 
      tour.tasks.map(task => ({ ...task, tourId: tour.id }))
    );
  };

  const getFreeSlotsForEmployee = (employeeId: string): FreeSlot[] => {
    const tasks = getTasksForEmployee(employeeId).sort((a, b) => 
      new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
    );

    const freeSlots: FreeSlot[] = [];
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(TIMELINE_START, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(TIMELINE_END, 0, 0, 0);

    if (tasks.length === 0) {
      freeSlots.push({
        start: startOfDay,
        end: endOfDay,
        topPx: 0,
        heightPx: (TIMELINE_END - TIMELINE_START) * PIXELS_PER_HOUR,
      });
      return freeSlots;
    }

    const firstTask = tasks[0];
    const firstTaskStart = new Date(firstTask.scheduledTime);
    if (firstTaskStart > startOfDay) {
      const topPx = getPixelsFromTop(startOfDay);
      const heightPx = getPixelsFromTop(firstTaskStart) - topPx;
      freeSlots.push({ start: startOfDay, end: firstTaskStart, topPx, heightPx });
    }

    for (let i = 0; i < tasks.length - 1; i++) {
      const currentTask = tasks[i];
      const nextTask = tasks[i + 1];
      const currentEnd = new Date(new Date(currentTask.scheduledTime).getTime() + currentTask.estimatedDuration * 60000);
      const nextStart = new Date(nextTask.scheduledTime);

      if (nextStart > currentEnd) {
        const topPx = getPixelsFromTop(currentEnd);
        const heightPx = getPixelsFromTop(nextStart) - topPx;
        freeSlots.push({ start: currentEnd, end: nextStart, topPx, heightPx });
      }
    }

    const lastTask = tasks[tasks.length - 1];
    const lastTaskEnd = new Date(new Date(lastTask.scheduledTime).getTime() + lastTask.estimatedDuration * 60000);
    if (lastTaskEnd < endOfDay) {
      const topPx = getPixelsFromTop(lastTaskEnd);
      const heightPx = getPixelsFromTop(endOfDay) - topPx;
      freeSlots.push({ start: lastTaskEnd, end: endOfDay, topPx, heightPx });
    }

    return freeSlots.filter(slot => slot.heightPx > 10);
  };

  const handleDragStart = (resident: Resident) => {
    setDraggedResident(resident);
  };

  const handleDrop = (employeeId: string, time: string) => {
    if (draggedResident) {
      setFormData({
        employeeId,
        residentId: draggedResident.id,
        startTime: time,
        duration: 30,
        taskType: 'koerperpflege',
        notes: '',
      });
      setShowDialog(true);
      setDraggedResident(null);
    } else if (draggedTask) {
      // Task innerhalb Timeline verschieben
      const oldTour = dayTours.find(t => t.id === draggedTask.tourId);
      if (!oldTour) return;

      // Task aus alter Tour entfernen
      const updatedOldTasks = oldTour.tasks.filter(t => t.id !== draggedTask.task.id);
      
      // Task zu neuer Tour hinzufügen (mit neuer Zeit)
      const [hours, minutes] = time.split(':').map(Number);
      const newScheduledTime = new Date(selectedDate);
      newScheduledTime.setHours(hours, minutes, 0, 0);
      
      const updatedTask = {
        ...draggedTask.task,
        scheduledTime: newScheduledTime.toISOString(),
      };

      if (draggedTask.employeeId === employeeId) {
        // Gleicher Mitarbeiter - nur Zeit ändern
        updateTour(oldTour.id, { tasks: [...updatedOldTasks, updatedTask] });
      } else {
        // Anderer Mitarbeiter - Tour wechseln
        updateTour(oldTour.id, { tasks: updatedOldTasks });
        
        let targetTour = dayTours.find(t => t.employeeId === employeeId);
        if (targetTour) {
          updateTour(targetTour.id, { tasks: [...targetTour.tasks, updatedTask] });
        } else {
          addTour({
            employeeId,
            date: dateStr,
            shift: hours < 14 ? 'early' : 'late',
            plannedStart: '06:00',
            plannedEnd: '14:00',
          });
        }
      }

      setDraggedTask(null);
    }
  };

  const handleEditTask = (task: Task, tourId: string) => {
    const tour = dayTours.find(t => t.id === tourId);
    if (!tour) return;

    const taskStart = new Date(task.scheduledTime);
    setFormData({
      employeeId: tour.employeeId,
      residentId: task.residentId,
      startTime: formatDate(taskStart, 'HH:mm'),
      duration: task.estimatedDuration,
      taskType: task.type,
      notes: task.notes || '',
    });
    setEditingTask({ task, tourId });
    setShowDialog(true);
  };

  const handleTaskDragStart = (task: Task, tourId: string, employeeId: string) => {
    setDraggedTask({ task, tourId, employeeId });
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
    setDragPosition(null);
  };

  const handleDeleteTask = (task: Task, tourId: string) => {
    if (!confirm('Einsatz wirklich löschen?')) return;
    
    const tour = dayTours.find(t => t.id === tourId);
    if (!tour) return;
    
    const updatedTasks = tour.tasks.filter(t => t.id !== task.id);
    updateTour(tourId, { tasks: updatedTasks });
  };

  const handleSaveTask = () => {
    if (!formData.employeeId) {
      alert('Bitte wähle einen Mitarbeiter aus');
      return;
    }
    
    if (formData.residentId !== 'driving' && !formData.residentId) {
      alert('Bitte wähle einen Bewohner aus');
      return;
    }

    const [hours, minutes] = formData.startTime.split(':').map(Number);
    const scheduledTime = new Date(selectedDate);
    scheduledTime.setHours(hours, minutes, 0, 0);

    const resident = residents.find(r => r.id === formData.residentId);
    const requirement = resident?.requirements.find(r => r.type === formData.taskType);

    if (editingTask) {
      // Task bearbeiten
      const tour = dayTours.find(t => t.id === editingTask.tourId);
      if (!tour) return;

      const updatedTasks = tour.tasks.map(t => 
        t.id === editingTask.task.id 
          ? {
              ...t,
              residentId: formData.residentId,
              type: formData.taskType,
              scheduledTime: scheduledTime.toISOString(),
              estimatedDuration: formData.duration,
              requiredQualification: requirement?.requiredQualification || 'grundpflege',
              notes: formData.notes,
              updatedAt: new Date().toISOString(),
            }
          : t
      );

      updateTour(tour.id, { tasks: updatedTasks });
      setEditingTask(null);
    } else {
      // Neuer Task erstellen
      const newTask: Task = {
        id: `task_${Date.now()}_${Math.random()}`,
        tourId: '',
        residentId: formData.residentId,
        type: formData.taskType,
        scheduledTime: scheduledTime.toISOString(),
        estimatedDuration: formData.duration,
        requiredQualification: requirement?.requiredQualification || 'grundpflege',
        status: 'pending',
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let tour = dayTours.find(t => t.employeeId === formData.employeeId);

      if (tour) {
        updateTour(tour.id, { tasks: [...tour.tasks, newTask] });
      } else {
        addTour({
          employeeId: formData.employeeId,
          date: dateStr,
          shift: hours < 14 ? 'early' : 'late',
          plannedStart: '06:00',
          plannedEnd: '14:00',
        });
      }
    }

    setShowDialog(false);
    setDraggedResident(null);
    setEditingTask(null);
  };

  // Helper: Füge Planning-Step hinzu
  const addPlanningStep = (type: PlanningStep['type'], status: PlanningStep['status'], title: string, details?: string) => {
    const step: PlanningStep = {
      id: `step-${Date.now()}-${Math.random()}`,
      type,
      status,
      title,
      details,
      timestamp: new Date(),
    };
    setPlanningSteps(prev => [...prev, step]);
    return step.id;
  };

  const updatePlanningStep = (id: string, status: PlanningStep['status'], details?: string) => {
    setPlanningSteps(prev => prev.map(step => 
      step.id === id ? { ...step, status, details: details || step.details } : step
    ));
  };

  // KI-Planungsfunktionen mit Agent (die KI kann direkt handeln!)
  const handleAIPlanning = async (action: 'create_full_plan' | 'optimize_existing') => {
    console.log('🚀 ========================================');
    console.log('🚀 handleAIPlanning GESTARTET');
    console.log('🚀 Action:', action);
    console.log('🚀 ========================================');
    
    setAiLoading(true);
    setAiResult(null);
    setPlanningSteps([]);
    setShowPlanningProgress(true);
    
    try {
      const dateStr = formatDate(selectedDate, 'yyyy-MM-dd');
      
      console.log('📅 Gewähltes Datum:', dateStr);
      console.log('👥 Mitarbeiter:', employees.length);
      console.log('🏠 Bewohner:', residents.length);
      console.log('🗓️ Existierende Touren für diesen Tag:', dayTours.length);
      
      addPlanningStep('thinking', 'running', 'Vorbereitung', `Datum: ${dateStr}\nMitarbeiter: ${employees.length}\nBewohner: ${residents.length}`);
      
      const context = preparePlanningContext(selectedDate, employees, residents, dayTours);
      
      const request = {
        context: {
          ...context,
          date: dateStr, // Wichtig: Nutze das ausgewählte Datum!
          employees,
          residents,
          existingTours: dayTours,
        },
        action,
      };

      const thinkStepId = addPlanningStep('thinking', 'running', 'KI denkt...', 'GPT-5 analysiert die Daten und erstellt einen Tourenplan');
      
      const response = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMsg = `${error.error}\n${error.hint || ''}\nDetails: ${JSON.stringify(error.details || {})}`;
        updatePlanningStep(thinkStepId, 'error', errorMsg);
        addPlanningStep('result', 'error', 'Fehler bei API-Request', errorMsg);
        throw new Error(error.error || 'API-Fehler');
      }

      const result = await response.json();
      
      console.log('📦 API Response:', result);
      
      if (!result.success) {
        const errMsg = `API war nicht erfolgreich: ${JSON.stringify(result)}`;
        console.error('❌', errMsg);
        addPlanningStep('result', 'error', 'API-Fehler', errMsg);
        throw new Error(errMsg);
      }
      
      if (!result.data || !result.data.actions) {
        const errMsg = `Keine Actions in Response: ${JSON.stringify(result)}`;
        console.error('❌', errMsg);
        addPlanningStep('result', 'error', 'Keine Actions', errMsg);
        throw new Error(errMsg);
      }
      
      console.log('✅ KI-Agent lieferte', result.data.actions.length, 'Actions');
      console.log('💭 Reasoning:', result.data.reasoning);
      
      if (result.success && result.data && result.data.actions) {
        updatePlanningStep(thinkStepId, 'completed', `KI hat ${result.data.actions.length} Actions geplant:\n${result.data.reasoning.substring(0, 200)}...`);
        
        addPlanningStep('result', 'running', 'Lösche alte Touren', `${dayTours.length} alte Touren werden entfernt`);
        dayTours.forEach(tour => useTourStore.getState().deleteTour(tour.id));
        console.log(`🗑️ ${dayTours.length} alte Touren gelöscht`);
        
        // Führe die Actions aus
        const createdTours = new Map<string, string>();
        let tourCount = 0;
        let taskCount = 0;
        
        console.log(`🔄 Starte Ausführung von ${result.data.actions.length} Actions...`);
        
        for (let i = 0; i < result.data.actions.length; i++) {
          const actItem = result.data.actions[i];
          
          console.log(`🔧 Action ${i+1}/${result.data.actions.length}:`, actItem.function, actItem.args);
          
          let stepId: string;
          let stepTitle: string;
          
          if (actItem.function === 'createTour') {
            tourCount++;
            const emp = employees.find(e => e.id === actItem.args.employeeId);
            stepTitle = `Tour ${tourCount}: ${emp?.name || 'Mitarbeiter'} (${actItem.args.shift})`;
            stepId = addPlanningStep('action', 'running', stepTitle, `${actItem.args.plannedStart} - ${actItem.args.plannedEnd}`);
            
            try {
              console.log('   📝 Erstelle Tour für:', emp?.name, actItem.args);
              const tour = addTour(actItem.args);
              createdTours.set('TOUR_ID_FROM_PREVIOUS_STEP', tour.id);
              console.log(`   ✅ Tour erstellt: ${tour.id}`);
              updatePlanningStep(stepId, 'completed', `✅ Tour-ID: ${tour.id.substring(0, 8)}...`);
            } catch (err) {
              console.error('   ❌ Fehler bei Tour-Erstellung:', err);
              updatePlanningStep(stepId, 'error', `❌ ${err}`);
            }
          } else if (actItem.function === 'addTaskToTour') {
            taskCount++;
            const tourId = actItem.args.tourId === 'TOUR_ID_FROM_PREVIOUS_STEP' 
              ? createdTours.get('TOUR_ID_FROM_PREVIOUS_STEP') || actItem.args.tourId
              : actItem.args.tourId;
            
            if (actItem.args.residentId === 'driving') {
              stepTitle = `  └─ 🚗 Fahrtzeit (${actItem.args.estimatedDuration}min)`;
            } else {
              const res = residents.find(r => r.id === actItem.args.residentId);
              stepTitle = `  └─ ${res?.name || 'Bewohner'}: ${actItem.args.type} (${actItem.args.estimatedDuration}min)`;
            }
            
            stepId = addPlanningStep('action', 'running', stepTitle);
            
            try {
              console.log(`   📝 Füge Task hinzu zu Tour ${tourId}:`, actItem.args);
              const task = addTask({
                ...actItem.args,
                tourId,
                requiredQualification: actItem.args.type === 'behandlungspflege' ? 'behandlungspflege' : 'grundpflege',
              });
              console.log(`   ✅ Task erstellt: ${task.id}`);
              updatePlanningStep(stepId, 'completed');
            } catch (err) {
              console.error('   ❌ Fehler bei Task-Erstellung:', err);
              updatePlanningStep(stepId, 'error', `❌ ${err}`);
            }
          }
          
          // Nur jede 5. Action anzeigen um UI nicht zu überlasten
          if (i % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
        
        console.log('🎉 Alle Actions ausgeführt!');
        console.log(`   📊 ${tourCount} Touren erstellt`);
        console.log(`   📊 ${taskCount} Einsätze hinzugefügt`);
        
        addPlanningStep('result', 'completed', 'Planung abgeschlossen!', `${tourCount} Touren mit ${taskCount} Einsätzen erstellt`);
        
        setAiResult({
          reasoning: result.data.reasoning,
          warnings: [`${tourCount} Touren erstellt, ${taskCount} Einsätze hinzugefügt`],
        });
        
        console.log('🔄 Lade Touren neu...');
        // Reload tours
        setTimeout(() => {
          loadTours();
          console.log('✅ Touren neu geladen');
        }, 500);
      }
    } catch (error) {
      console.error('❌ KI-Agent-Fehler:', error);
      addPlanningStep('result', 'error', 'Fehler', error instanceof Error ? error.message : 'Unbekannter Fehler');
    } finally {
      setAiLoading(false);
    }
  };

  const timeSlots: string[] = [];
  for (let hour = TIMELINE_START; hour <= TIMELINE_END; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Tourenplanung</h1>
            
            <div className="flex items-center gap-3">
              {/* KI-Buttons */}
              <button 
                onClick={() => handleAIPlanning('create_full_plan')} 
                disabled={aiLoading}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                {aiLoading ? 'KI plant...' : 'KI-Planung starten'}
              </button>
              
              {dayTours.length > 0 && (
                <button 
                  onClick={() => handleAIPlanning('optimize_existing')} 
                  disabled={aiLoading}
                  className="px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  {aiLoading ? '...' : 'Optimieren'}
                </button>
              )}
              
              <div className="w-px h-8 bg-gray-300" />
              
              <button onClick={goToToday} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Heute
              </button>
              
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button onClick={goToPreviousDay} className="p-1.5 hover:bg-gray-200 rounded-l-lg transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="px-4 py-1.5 min-w-[130px] text-center">
                  <div className="text-sm font-bold text-gray-900">{formatDate(selectedDate, 'EEEE')}</div>
                  <div className="text-xs text-gray-600">{formatDate(selectedDate, 'dd.MM.yyyy')}</div>
                </div>
                
                <button onClick={goToNextDay} className="p-1.5 hover:bg-gray-200 rounded-r-lg transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Bewohner */}
        <div className="w-72 bg-gradient-to-b from-blue-50 to-white border-r border-blue-100 flex-shrink-0 overflow-y-auto shadow-sm">
          <div className="p-4 border-b border-blue-200 bg-gradient-to-r from-blue-100 to-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Bewohner</h2>
                <p className="text-xs text-gray-600">{activeResidents.length} aktiv</p>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {activeResidents.map((resident, index) => {
              const careLevelColors = {
                1: 'bg-blue-100 text-blue-700 border-blue-300',
                2: 'bg-green-100 text-green-700 border-green-300',
                3: 'bg-yellow-100 text-yellow-700 border-yellow-300',
                4: 'bg-orange-100 text-orange-700 border-orange-300',
                5: 'bg-red-100 text-red-700 border-red-300',
              };
              const levelColor = careLevelColors[resident.careLevel as keyof typeof careLevelColors] || 'bg-gray-100 text-gray-700 border-gray-300';
              
              return (
                <div
                  key={resident.id}
                  draggable
                  onDragStart={() => handleDragStart(resident)}
                  className="p-3 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg cursor-move transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{resident.name}</div>
                      <div className="text-xs text-gray-600 truncate mt-0.5">
                        📍 {resident.address.street} {resident.address.houseNumber}
                      </div>
                    </div>
                    <div className={`px-2 py-1 ${levelColor} border rounded-full text-xs font-bold whitespace-nowrap shadow-sm`}>
                      PG {resident.careLevel}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {resident.requirements.slice(0, 3).map((req, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-medium">
                        {req.type}
                      </span>
                    ))}
                    {resident.requirements.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[10px] font-medium">
                        +{resident.requirements.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          </div>

        {/* Timeline Center */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-lg shadow-lg border min-w-[1000px]">
            <div className="flex">
              {/* Zeit-Spalte */}
              <div className="w-16 border-r bg-gray-50 flex-shrink-0 relative">
                <div className="h-12 border-b flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="relative" style={{ height: `${(TIMELINE_END - TIMELINE_START) * PIXELS_PER_HOUR}px` }}>
                  {/* Stunden-Linien */}
                  {timeSlots.map((time, index) => (
                    <div key={time} className="absolute left-0 right-0 border-t border-gray-200" style={{ top: `${index * PIXELS_PER_HOUR}px` }}>
                      <div className="text-[10px] font-semibold text-gray-700 p-1">{time}</div>
                    </div>
                  ))}

                  {/* Minuten-Lineal beim Drag */}
                  {draggedTask && dragPosition && (
                    <div
                      className="absolute left-0 right-0 border-t-2 border-red-500 pointer-events-none transition-all duration-75 z-50"
                      style={{ top: `${((dragPosition.minutes - TIMELINE_START * 60) / 60) * PIXELS_PER_HOUR}px` }}
                    >
                      <div className="text-xs font-bold px-1 text-red-600 bg-red-50 rounded shadow-sm inline-block">
                        {String(Math.floor(dragPosition.minutes / 60)).padStart(2, '0')}:{String(dragPosition.minutes % 60).padStart(2, '0')}
                      </div>
                    </div>
                  )}
                          </div>
                          </div>

              {/* Mitarbeiter-Spalten */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex">
                  {activeEmployees.map((employee) => {
                    const stats = getTotalStatsForEmployee(employee.id);
                    const tasks = getTasksForEmployee(employee.id);
                    const freeSlots = getFreeSlotsForEmployee(employee.id);
                    const isSelected = selectedEmployeeId === employee.id;

                    return (
                      <div key={employee.id} className="flex-1 min-w-[220px] border-r last:border-r-0">
                        {/* Mitarbeiter Header */}
                        <div 
                          onClick={() => setSelectedEmployeeId(isSelected ? null : employee.id)}
                          className={`h-12 border-b p-2 cursor-pointer transition-colors ${
                            isSelected ? 'bg-primary-100 border-primary-300' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <UserIcon className="w-4 h-4 text-primary-600" />
                            <span className="font-bold text-xs text-gray-900 truncate">{employee.name}</span>
                          </div>
                          <div className="text-[10px] text-gray-600">{stats.tasks} • {formatDuration(stats.duration)}</div>
                        </div>

                        {/* Timeline mit Kacheln */}
                        <div 
                          className="relative bg-gradient-to-b from-gray-50 to-white"
                          style={{ height: `${(TIMELINE_END - TIMELINE_START) * PIXELS_PER_HOUR}px` }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const y = e.clientY - rect.top;
                            const minutes = Math.floor(TIMELINE_START * 60 + (y / PIXELS_PER_HOUR) * 60);
                            setDragPosition({ y, minutes });
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const y = e.clientY - rect.top;
                            const minutes = TIMELINE_START * 60 + (y / PIXELS_PER_HOUR) * 60;
                            const hours = Math.floor(minutes / 60);
                            const mins = Math.floor(minutes % 60);
                            const time = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
                            handleDrop(employee.id, time);
                          }}
                        >
                          {/* Stunden-Linien */}
                          {timeSlots.map((time, index) => (
                            <div key={time} className="absolute left-0 right-0 border-t border-gray-100" style={{ top: `${index * PIXELS_PER_HOUR}px` }} />
                          ))}

                          {/* Freie Slots (wenn Mitarbeiter selected) */}
                          {isSelected && freeSlots.map((slot, index) => (
                            <div
                              key={index}
                              className="absolute left-0 right-0 bg-green-100 bg-opacity-30 border-2 border-dashed border-green-400 pointer-events-none"
                              style={{
                                top: `${slot.topPx}px`,
                                height: `${slot.heightPx}px`,
                              }}
                            />
                          ))}

                          {/* Einsatz-Kacheln */}
                          {tasks.map((task, taskIndex) => {
                            const resident = residents.find(r => r.id === task.residentId);
                            const isDriving = task.residentId === 'driving';
                            
                            // Live-Zeit während Drag
                            const isBeingDragged = draggedTask?.task.id === task.id && draggedTask.employeeId === employee.id;
                            let displayStart = new Date(task.scheduledTime);
                            let displayEnd = new Date(displayStart.getTime() + task.estimatedDuration * 60000);
                            let topPosition = getPixelsFromTop(task.scheduledTime);
                            
                            if (isBeingDragged && dragPosition) {
                              const newStartDate = new Date(selectedDate);
                              const hours = Math.floor(dragPosition.minutes / 60);
                              const mins = dragPosition.minutes % 60;
                              newStartDate.setHours(hours, mins, 0, 0);
                              displayStart = newStartDate;
                              displayEnd = new Date(displayStart.getTime() + task.estimatedDuration * 60000);
                              topPosition = ((dragPosition.minutes - TIMELINE_START * 60) / 60) * PIXELS_PER_HOUR;
                            }
                            
                            const height = getHeightInPixels(task.estimatedDuration);
                            const colors = getTaskColor(task.type, isDriving);

                            // Prüfe ob darüber oder darunter eine Task liegt (Überlappung)
                            const overlappingTasks = tasks.filter((t, idx) => {
                              if (idx === taskIndex || t.id === task.id) return false;
                              const tStart = new Date(t.scheduledTime);
                              const tEnd = new Date(tStart.getTime() + t.estimatedDuration * 60000);
                              const taskStart = new Date(task.scheduledTime);
                              const taskEnd = new Date(taskStart.getTime() + task.estimatedDuration * 60000);
                              return (tStart >= taskStart && tStart < taskEnd) || (tEnd > taskStart && tEnd <= taskEnd) || (tStart <= taskStart && tEnd >= taskEnd);
                            });
                            const hasOverlap = overlappingTasks.length > 0;

                            return (
                              <div key={task.id} className="relative">
                                <div
                                  draggable={true}
                                  onDragStart={(e) => {
                                    handleTaskDragStart(task, task.tourId, employee.id);
                                    e.dataTransfer.effectAllowed = 'move';
                                    // Ghost-Image ausblenden
                                    const ghost = document.createElement('div');
                                    ghost.style.opacity = '0';
                                    ghost.style.position = 'absolute';
                                    ghost.style.top = '-1000px';
                                    document.body.appendChild(ghost);
                                    e.dataTransfer.setDragImage(ghost, 0, 0);
                                    setTimeout(() => document.body.removeChild(ghost), 0);
                                  }}
                                  onDragEnd={handleTaskDragEnd}
                                  className={`absolute left-1 right-1 ${colors.bg} border-2 ${colors.border} rounded p-1.5 hover:shadow-lg hover:z-20 cursor-move group overflow-hidden ${isBeingDragged ? 'shadow-2xl z-30' : ''}`}
                                  style={{ 
                                    top: `${topPosition}px`, 
                                    height: `${Math.max(height, isDriving ? 20 : 30)}px`, 
                                    minHeight: isDriving ? '20px' : '30px',
                                    opacity: hasOverlap ? 0.75 : 1,
                                    transition: isBeingDragged ? 'none' : 'all 0.15s',
                                  }}
                                >
                                  <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity z-30">
                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleEditTask(task, task.tourId); 
                                      }} 
                                      className="p-0.5 bg-white rounded hover:bg-blue-50 shadow-sm"
                                    >
                                      <Edit2 className="w-3 h-3 text-blue-600" />
                                    </button>
                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleDeleteTask(task, task.tourId); 
                                      }} 
                                      className="p-0.5 bg-white rounded hover:bg-red-50 shadow-sm"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-600" />
                                    </button>
                                  </div>

                                  <div className={`text-[9px] font-bold ${colors.text} truncate`}>
                                    {formatDate(displayStart, 'HH:mm')} - {formatDate(displayEnd, 'HH:mm')}
                                  </div>
                                  
                                  {isDriving ? (
                                    <div className="text-[9px] text-green-700 font-medium">🚗 Fahrtzeit</div>
                                  ) : (
                                    <>
                                      <div className={`text-[10px] font-semibold ${colors.text} truncate`}>{resident?.name || 'Unbekannt'}</div>
                                      {height > 40 && (
                                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                                          <span className={`px-1 py-0.5 ${colors.badge} rounded text-[8px] font-medium`}>{task.type}</span>
                    </div>
                  )}
                                      {task.notes && height > 55 && (
                                        <div className="text-[8px] text-gray-600 mt-0.5 italic truncate">{task.notes}</div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Mitarbeiter Liste */}
        <div className="w-64 bg-gradient-to-b from-purple-50 to-white border-l border-purple-100 flex-shrink-0 overflow-y-auto shadow-sm">
          <div className="p-4 border-b border-purple-200 bg-gradient-to-r from-purple-100 to-purple-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Mitarbeiter</h2>
                <p className="text-xs text-gray-600">{activeEmployees.length} im Dienst</p>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {activeEmployees.map((employee) => {
              const stats = getTotalStatsForEmployee(employee.id);
              const isExaminiert = employee.qualifications.includes('behandlungspflege');
              
              return (
                <div
                  key={employee.id}
                  onClick={() => setSelectedEmployeeId(selectedEmployeeId === employee.id ? null : employee.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                    selectedEmployeeId === employee.id 
                      ? 'bg-gradient-to-br from-primary-100 to-primary-50 border-2 border-primary-500 ring-2 ring-primary-200' 
                      : 'bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-primary-600" />
                        <div className="text-sm font-bold text-gray-900 truncate">{employee.name}</div>
                      </div>
                      {isExaminiert && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 border border-green-300 rounded-full text-[10px] font-bold">
                          ✓ Examiniert
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1">
                      <div className="text-[10px] text-gray-600">Einsätze</div>
                      <div className="text-sm font-bold text-blue-700">{stats.tasks}</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded px-2 py-1">
                      <div className="text-[10px] text-gray-600">Zeit</div>
                      <div className="text-[11px] font-bold text-purple-700">{formatDuration(stats.duration)}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {employee.qualifications.slice(0, 3).map(q => (
                      <span key={q} className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-medium">
                        {q.replace('_', ' ')}
                      </span>
                    ))}
                    {employee.qualifications.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-[9px] font-medium">
                        +{employee.qualifications.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dialog: Einsatz erstellen/bearbeiten */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editingTask ? 'Einsatz bearbeiten' : 'Neuen Einsatz erstellen'}</h2>
              <button onClick={() => { setShowDialog(false); setEditingTask(null); }} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Einsatztyp</label>
                <select 
                  value={formData.residentId === 'driving' ? 'driving' : 'resident'} 
                  onChange={(e) => {
                    if (e.target.value === 'driving') {
                      setFormData({ ...formData, residentId: 'driving', taskType: 'dokumentation', notes: 'Fahrtzeit', duration: 10 });
                    } else {
                      setFormData({ ...formData, residentId: '', taskType: 'koerperpflege', notes: '' });
                    }
                  }} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="resident">🏠 Bewohner-Einsatz</option>
                  <option value="driving">🚗 Fahrtzeit</option>
                </select>
              </div>

              {formData.residentId !== 'driving' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bewohner</label>
                  <select value={formData.residentId} onChange={(e) => setFormData({ ...formData, residentId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 text-sm">
                    <option value="">Bitte wählen...</option>
                    {activeResidents.map(res => (
                      <option key={res.id} value={res.id}>{res.name} - {res.address.street} {res.address.houseNumber}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Startzeit</label>
                  <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dauer (Min)</label>
                  <input type="number" min="5" max="180" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 text-sm" />
                </div>
              </div>

              {formData.residentId !== 'driving' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leistungsart</label>
                  <select value={formData.taskType} onChange={(e) => setFormData({ ...formData, taskType: e.target.value as TaskType })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 text-sm">
                    <option value="koerperpflege">Körperpflege</option>
                    <option value="medikamente">Medikamente</option>
                    <option value="mobilisation">Mobilisation</option>
                    <option value="wundversorgung">Wundversorgung</option>
                    <option value="ernaehrung">Ernährung</option>
                    <option value="dokumentation">Dokumentation</option>
                    <option value="arztbesuch">Arztbesuch</option>
                    <option value="freizeitgestaltung">Freizeitgestaltung</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} placeholder={formData.residentId === 'driving' ? 'Fahrtzeit zwischen Einsätzen' : 'z.B. Dusche, Tabletten geben...'} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
        </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setShowDialog(false); setEditingTask(null); }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm">
                Abbrechen
              </button>
              <button onClick={handleSaveTask} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" />
                Speichern
            </button>
            </div>
          </div>
          </div>
        )}

      {/* KI-Result Dialog */}
      {showAiDialog && aiResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">KI-Planung abgeschlossen</h2>
                  <p className="text-sm text-gray-600">Die Touren wurden erfolgreich erstellt</p>
                </div>
              </div>
              <button onClick={() => setShowAiDialog(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💡 KI-Reasoning</h3>
                <p className="text-sm text-blue-800">{aiResult.reasoning}</p>
              </div>

              {aiResult.warnings && aiResult.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Warnungen</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {aiResult.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-yellow-800">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end">
                <button 
                  onClick={() => setShowAiDialog(false)} 
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  Verstanden
                </button>
              </div>
            </div>
          </div>
      </div>
      )}

      {/* AI Chat Widget */}
      <AIChat />

      {/* Planning Progress Dialog */}
      <PlanningProgress
        isOpen={showPlanningProgress}
        onClose={() => setShowPlanningProgress(false)}
        steps={planningSteps}
      />
    </div>
  );
}
