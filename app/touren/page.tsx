'use client';

import { initializeMockTours } from '@/lib/services/mockTours';
import { useEmployeeStore } from '@/lib/store/employeeStore';
import { useResidentStore } from '@/lib/store/residentStore';
import { useTourStore } from '@/lib/store/tourStore';
import type { Task, TaskType } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Edit2, Plus, Save, Trash2, User as UserIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const TIMELINE_START = 6;
const TIMELINE_END = 22; 
const PIXELS_PER_HOUR = 120;

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

export default function TourenPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  }, [employees.length, residents.length, selectedDate, mounted]);

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
    const allTasks = employeeTours.flatMap(t => t.tasks);
    const totalMinutes = allTasks.reduce((sum, task) => sum + task.estimatedDuration, 0);
    
    return {
      tasks: allTasks.length,
      duration: totalMinutes,
    };
  };

  const getTasksForEmployee = (employeeId: string) => {
    const employeeTours = dayTours.filter(t => t.employeeId === employeeId);
    return employeeTours.flatMap(tour => 
      tour.tasks.map(task => ({ ...task, tourId: tour.id }))
    );
  };

  const handleAddTask = (employeeId: string) => {
    setEditingTask(null);
    setFormData({
      employeeId,
      residentId: '',
      startTime: '08:00',
      duration: 30,
      taskType: 'koerperpflege',
      notes: '',
    });
    setShowDialog(true);
  };

  const handleEditTask = (task: Task, tourId: string) => {
    const taskTime = new Date(task.scheduledTime);
    setEditingTask(task);
    
    const tour = dayTours.find(t => t.id === tourId);
    
    setFormData({
      employeeId: tour?.employeeId || '',
      residentId: task.residentId,
      startTime: `${taskTime.getHours().toString().padStart(2, '0')}:${taskTime.getMinutes().toString().padStart(2, '0')}`,
      duration: task.estimatedDuration,
      taskType: task.type,
      notes: task.notes || '',
    });
    setShowDialog(true);
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

    const newTask: Task = editingTask ? {
      ...editingTask,
      residentId: formData.residentId,
      type: formData.taskType,
      scheduledTime: scheduledTime.toISOString(),
      estimatedDuration: formData.duration,
      requiredQualification: requirement?.requiredQualification || 'grundpflege',
      notes: formData.notes,
      updatedAt: new Date().toISOString(),
    } : {
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

    if (editingTask && tour) {
      const updatedTasks = tour.tasks.map(t => t.id === editingTask.id ? newTask : t);
      updateTour(tour.id, { tasks: updatedTasks });
    } else if (tour) {
      updateTour(tour.id, { tasks: [...tour.tasks, newTask] });
    } else {
      addTour({
        employeeId: formData.employeeId,
        date: dateStr,
        shift: hours < 14 ? 'early' : 'late',
        plannedStart: '06:00',
        plannedEnd: '14:00',
      });
      
      setTimeout(() => {
        const newTour = tours.find(t => t.employeeId === formData.employeeId && t.date === dateStr);
        if (newTour) {
          updateTour(newTour.id, { tasks: [newTask] });
        }
      }, 100);
    }

    setShowDialog(false);
    setEditingTask(null);
  };

  const timeSlots: string[] = [];
  for (let hour = TIMELINE_START; hour <= TIMELINE_END; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Tourenplanung</h1>
            
            <div className="flex items-center gap-3">
              <button onClick={goToToday} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Heute
              </button>
              
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button 
                  onClick={goToPreviousDay} 
                  className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="px-4 py-2 min-w-[140px] text-center">
                  <div className="text-sm font-bold text-gray-900">
                    {formatDate(selectedDate, 'EEEE')}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatDate(selectedDate, 'dd.MM.yyyy')}
                  </div>
                </div>
                
                <button 
                  onClick={goToNextDay} 
                  className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-600">Touren heute</div>
              <div className="text-xl font-bold text-gray-900">{dayTours.length}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-600">Mitarbeiter im Einsatz</div>
              <div className="text-xl font-bold text-gray-900">
                {new Set(dayTours.map(t => t.employeeId)).size}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-600">Einsätze gesamt</div>
              <div className="text-xl font-bold text-gray-900">
                {dayTours.reduce((sum, t) => sum + t.tasks.length, 0)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-600">Gesamtzeit</div>
              <div className="text-xl font-bold text-gray-900">
                {formatDuration(dayTours.reduce((sum, t) => 
                  sum + t.tasks.reduce((taskSum, task) => taskSum + task.estimatedDuration, 0), 0
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border">
          <div className="flex">
            {/* Zeit-Spalte */}
            <div className="w-20 border-r bg-gray-50 flex-shrink-0">
              <div className="h-16 border-b flex items-center justify-center">
                <Clock className="w-4 h-4 text-gray-500" />
              </div>
              <div className="relative" style={{ height: `${(TIMELINE_END - TIMELINE_START) * PIXELS_PER_HOUR}px` }}>
                {timeSlots.map((time, index) => (
                  <div 
                    key={time}
                    className="absolute left-0 right-0 border-t border-gray-200"
                    style={{ top: `${index * PIXELS_PER_HOUR}px` }}
                  >
                    <div className="text-xs font-semibold text-gray-700 p-2">
                      {time}
                    </div>
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

                  return (
                    <div key={employee.id} className="flex-1 min-w-[250px] border-r last:border-r-0">
                      {/* Mitarbeiter Header */}
                      <div className="h-16 border-b bg-gray-50 p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <UserIcon className="w-4 h-4 text-primary-600" />
                          <span className="font-bold text-sm text-gray-900 truncate">{employee.name}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {stats.tasks} Einsätze • {formatDuration(stats.duration)}
                        </div>
                      </div>

                      {/* Timeline mit Kacheln */}
                      <div 
                        className="relative bg-gradient-to-b from-gray-50 to-white"
                        style={{ height: `${(TIMELINE_END - TIMELINE_START) * PIXELS_PER_HOUR}px` }}
                      >
                        {/* Stunden-Linien */}
                        {timeSlots.map((time, index) => (
                          <div 
                            key={time}
                            className="absolute left-0 right-0 border-t border-gray-100"
                            style={{ top: `${index * PIXELS_PER_HOUR}px` }}
                          />
                        ))}

                        {/* Halbe-Stunden-Linien */}
                        {timeSlots.slice(0, -1).map((time, index) => (
                          <div 
                            key={`${time}-half`}
                            className="absolute left-0 right-0 border-t border-dashed border-gray-100"
                            style={{ top: `${index * PIXELS_PER_HOUR + PIXELS_PER_HOUR / 2}px` }}
                          />
                        ))}

                        {/* Plus Button (ganze Spalte klickbar) */}
                        <button
                          onClick={() => handleAddTask(employee.id)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-primary-50 hover:bg-opacity-50 transition-all group z-10"
                        >
                          <div className="bg-primary-600 text-white rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                          </div>
                        </button>

                        {/* Einsatz-Kacheln */}
                        {tasks.map((task) => {
                          const resident = residents.find(r => r.id === task.residentId);
                          const taskStart = new Date(task.scheduledTime);
                          const taskEnd = new Date(taskStart.getTime() + task.estimatedDuration * 60000);
                          
                          const topPosition = getPixelsFromTop(task.scheduledTime);
                          const height = getHeightInPixels(task.estimatedDuration);

                          return (
                            <div
                              key={task.id}
                              className="absolute left-1 right-1 bg-blue-100 border-2 border-blue-300 rounded-lg p-2 hover:shadow-lg hover:z-20 transition-all cursor-pointer group overflow-hidden"
                              style={{
                                top: `${topPosition}px`,
                                height: `${height}px`,
                                minHeight: '40px',
                              }}
                            >
                              {/* Edit/Delete Buttons */}
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity z-30">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTask(task, task.tourId);
                                  }}
                                  className="p-1 bg-white rounded hover:bg-gray-100 shadow"
                                >
                                  <Edit2 className="w-3 h-3 text-gray-600" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTask(task, task.tourId);
                                  }}
                                  className="p-1 bg-white rounded hover:bg-red-50 shadow"
                                >
                                  <Trash2 className="w-3 h-3 text-red-600" />
                                </button>
                              </div>

                              {/* Content */}
                              <div className="text-[10px] font-bold text-gray-900 mb-0.5">
                                {formatDate(taskStart, 'HH:mm')} - {formatDate(taskEnd, 'HH:mm')}
                              </div>
                              
                              <div className="text-xs font-semibold text-gray-800 mb-0.5 truncate">
                                {resident?.name || 'Unbekannt'}
                              </div>

                              {resident?.address && height > 60 && (
                                <div className="text-[9px] text-gray-600 truncate">
                                  {resident.address.street} {resident.address.houseNumber}
                                </div>
                              )}

                              {height > 40 && (
                                <div className="flex flex-wrap gap-0.5 mt-1">
                                  <span className="px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded text-[9px] font-medium">
                                    {task.type}
                                  </span>
                                  {resident && (
                                    <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded text-[9px]">
                                      PG {resident.careLevel}
                                    </span>
                                  )}
                                </div>
                              )}

                              {task.notes && height > 80 && (
                                <div className="text-[9px] text-gray-600 mt-1 italic truncate">
                                  {task.notes}
                                </div>
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

      {/* Dialog: Einsatz erstellen/bearbeiten */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingTask ? 'Einsatz bearbeiten' : 'Neuen Einsatz erstellen'}
              </h2>
              <button onClick={() => setShowDialog(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Mitarbeiter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mitarbeiter *
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  disabled={editingTask !== null}
                >
                  <option value="">Bitte wählen...</option>
                  {activeEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              {/* Bewohner */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bewohner *
                </label>
                <select
                  value={formData.residentId}
                  onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Bitte wählen...</option>
                  {residents.filter(r => r.status === 'active').map(res => (
                    <option key={res.id} value={res.id}>
                      {res.name} - {res.address.street} {res.address.houseNumber} (PG {res.careLevel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Startzeit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Startzeit *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Dauer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dauer (Minuten) *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    step="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Leistungsart */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leistungsart *
                </label>
                <select
                  value={formData.taskType}
                  onChange={(e) => setFormData({ ...formData, taskType: e.target.value as TaskType })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                >
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

              {/* Notizen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notizen
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="z.B. Strümpfe anziehen, Dusche, Tabletten geben..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Abbrechen
              </button>
              <button 
                onClick={handleSaveTask}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
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
