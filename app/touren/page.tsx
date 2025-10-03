'use client';

import { initializeMockTours } from '@/lib/services/mockTours';
import { useEmployeeStore } from '@/lib/store/employeeStore';
import { useResidentStore } from '@/lib/store/residentStore';
import { useTourStore } from '@/lib/store/tourStore';
import type { Resident, Task, TaskType } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Home, Save, Trash2, User as UserIcon, Users, X } from 'lucide-react';
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
    mobilisation: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-900', badge: 'bg-emerald-200 text-emerald-800' },
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
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
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
    if (!draggedResident) return;

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
  };

  const handleDeleteTask = (task: Task, tourId: string) => {
    if (!confirm('Einsatz wirklich löschen?')) return;
    
    const tour = dayTours.find(t => t.id === tourId);
    if (!tour) return;
    
    const updatedTasks = tour.tasks.filter(t => t.id !== task.id);
    updateTour(tourId, { tasks: updatedTasks });
  };

  const handleSaveTask = () => {
    if (!formData.employeeId || !formData.residentId) {
      alert('Bitte wähle Mitarbeiter und Bewohner aus');
      return;
    }

    const [hours, minutes] = formData.startTime.split(':').map(Number);
    const scheduledTime = new Date(selectedDate);
    scheduledTime.setHours(hours, minutes, 0, 0);

    const resident = residents.find(r => r.id === formData.residentId);
    const requirement = resident?.requirements.find(r => r.type === formData.taskType);

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

    setShowDialog(false);
    setDraggedResident(null);
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
        <div className="w-64 bg-white border-r flex-shrink-0 overflow-y-auto">
          <div className="p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4 text-gray-600" />
              <h2 className="text-sm font-bold text-gray-900">Bewohner</h2>
            </div>
            <p className="text-xs text-gray-600">{activeResidents.length} aktiv</p>
          </div>
          <div className="p-2 space-y-1">
            {activeResidents.map((resident) => (
              <div
                key={resident.id}
                draggable
                onDragStart={() => handleDragStart(resident)}
                className="p-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded cursor-move transition-colors"
              >
                <div className="text-sm font-semibold text-gray-900 truncate">{resident.name}</div>
                <div className="text-xs text-gray-600 truncate">{resident.address.street} {resident.address.houseNumber}</div>
                <div className="flex gap-1 mt-1">
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px]">PG {resident.careLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Center */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-white rounded-lg shadow-lg border min-w-[1000px]">
            <div className="flex">
              {/* Zeit-Spalte */}
              <div className="w-16 border-r bg-gray-50 flex-shrink-0">
                <div className="h-12 border-b flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="relative" style={{ height: `${(TIMELINE_END - TIMELINE_START) * PIXELS_PER_HOUR}px` }}>
                  {timeSlots.map((time, index) => (
                    <div key={time} className="absolute left-0 right-0 border-t border-gray-200" style={{ top: `${index * PIXELS_PER_HOUR}px` }}>
                      <div className="text-[10px] font-semibold text-gray-700 p-1">{time}</div>
                    </div>
                  ))}
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
                          onDragOver={(e) => e.preventDefault()}
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
                          {tasks.map((task) => {
                            const resident = residents.find(r => r.id === task.residentId);
                            const isDriving = task.residentId === 'driving';
                            const taskStart = new Date(task.scheduledTime);
                            const taskEnd = new Date(taskStart.getTime() + task.estimatedDuration * 60000);
                            
                            const topPosition = getPixelsFromTop(task.scheduledTime);
                            const height = getHeightInPixels(task.estimatedDuration);
                            const colors = getTaskColor(task.type, isDriving);

                            return (
                              <div
                                key={task.id}
                                className={`absolute left-1 right-1 ${colors.bg} border-2 ${colors.border} rounded p-1.5 hover:shadow-lg hover:z-20 transition-all cursor-pointer group overflow-hidden`}
                                style={{ top: `${topPosition}px`, height: `${height}px`, minHeight: '30px' }}
                              >
                                {!isDriving && (
                                  <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 flex gap-0.5 transition-opacity z-30">
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(task, task.tourId); }} className="p-0.5 bg-white rounded hover:bg-red-50 shadow-sm">
                                      <Trash2 className="w-3 h-3 text-red-600" />
                                    </button>
                                  </div>
                                )}

                                <div className={`text-[9px] font-bold ${colors.text} truncate`}>
                                  {formatDate(taskStart, 'HH:mm')} - {formatDate(taskEnd, 'HH:mm')}
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
        <div className="w-56 bg-white border-l flex-shrink-0 overflow-y-auto">
          <div className="p-3 border-b bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-gray-600" />
              <h2 className="text-sm font-bold text-gray-900">Mitarbeiter</h2>
            </div>
            <p className="text-xs text-gray-600">{activeEmployees.length} im Dienst</p>
          </div>
          <div className="p-2 space-y-1">
            {activeEmployees.map((employee) => {
              const stats = getTotalStatsForEmployee(employee.id);
              return (
                <div
                  key={employee.id}
                  onClick={() => setSelectedEmployeeId(selectedEmployeeId === employee.id ? null : employee.id)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedEmployeeId === employee.id 
                      ? 'bg-primary-100 border-2 border-primary-400' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-900 truncate">{employee.name}</div>
                  <div className="text-xs text-gray-600">{stats.tasks} Einsätze</div>
                  <div className="text-xs text-gray-600">{formatDuration(stats.duration)}</div>
                  <div className="flex flex-wrap gap-0.5 mt-1">
                    {employee.qualifications.slice(0, 2).map(q => (
                      <span key={q} className="px-1 py-0.5 bg-primary-100 text-primary-700 rounded text-[9px]">{q}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dialog: Einsatz erstellen */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Neuen Einsatz erstellen</h2>
              <button onClick={() => setShowDialog(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bewohner</label>
                <select value={formData.residentId} onChange={(e) => setFormData({ ...formData, residentId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 text-sm">
                  <option value="">Bitte wählen...</option>
                  {activeResidents.map(res => (
                    <option key={res.id} value={res.id}>{res.name} - {res.address.street} {res.address.houseNumber}</option>
                  ))}
                </select>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} placeholder="z.B. Dusche, Tabletten geben..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 text-sm" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowDialog(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm">
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
    </div>
  );
}
