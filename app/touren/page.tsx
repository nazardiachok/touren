'use client';

import { initializeMockData } from '@/lib/services/mockData';
import { useTourStore } from '@/lib/store/tourStore';
import { formatDate, getDayName, getWeekDates, getWeekStart } from '@/lib/utils/date';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TourenPage() {
  const [mounted, setMounted] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart());
  const tours = useTourStore(state => state.tours);
  const loadTours = useTourStore(state => state.loadTours);

  useEffect(() => {
    setMounted(true);
    initializeMockData();
    loadTours();
  }, [loadTours]);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  const weekDates = getWeekDates(currentWeekStart);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getWeekStart());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Tourenplanung</h1>
            <div className="flex items-center gap-4">
              <button onClick={goToCurrentWeek} className="btn-secondary text-sm">
                Heute
              </button>
              <div className="flex items-center gap-2">
                <button onClick={goToPreviousWeek} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-lg font-semibold min-w-[200px] text-center">
                  {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                </span>
                <button onClick={goToNextWeek} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {weekDates.map((date, i) => {
              const isToday = formatDate(date, 'yyyy-MM-dd') === formatDate(new Date(), 'yyyy-MM-dd');
              return (
                <div key={i} className={`p-4 text-center border-r border-gray-200 last:border-r-0 ${isToday ? 'bg-primary-50' : ''}`}>
                  <div className="font-semibold text-gray-900">{getDayName(date)}</div>
                  <div className={`text-2xl font-bold mt-1 ${isToday ? 'text-primary-600' : 'text-gray-600'}`}>
                    {formatDate(date, 'd')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{formatDate(date, 'MMM')}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 min-h-[600px]">
            {weekDates.map((date, i) => {
              const dateStr = formatDate(date, 'yyyy-MM-dd');
              const dayTours = tours.filter(t => t.date === dateStr);
              
              return (
                <div key={i} className="border-r border-gray-200 last:border-r-0 p-4 bg-gray-50">
                  {dayTours.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                      <Calendar className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Keine Touren</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dayTours.map(tour => (
                        <div key={tour.id} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {tour.employee?.name || 'Unbekannt'}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {tour.plannedStart} - {tour.plannedEnd}
                          </div>
                          <div className="text-xs text-primary-600 mt-1">
                            {tour.tasks.length} Aufgaben
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {tours.length === 0 && (
          <div className="card mt-8 text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Noch keine Touren geplant</h3>
            <p className="text-gray-600 mb-6">
              Erstelle deine erste Tour mit Mitarbeitern und Bewohnern.
            </p>
            <button className="btn-primary">
              Erste Tour erstellen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

