'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Users, Home, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useEmployeeStore } from '@/lib/store/employeeStore';
import { useResidentStore } from '@/lib/store/residentStore';
import { useTourStore } from '@/lib/store/tourStore';
import { formatDate, getWeekStart, getWeekEnd } from '@/lib/utils/date';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const employees = useEmployeeStore(state => state.employees);
  const residents = useResidentStore(state => state.residents);
  const tours = useTourStore(state => state.tours);
  const tasks = useTourStore(state => state.tasks);
  const loadEmployees = useEmployeeStore(state => state.loadEmployees);
  const loadResidents = useResidentStore(state => state.loadResidents);
  const loadTours = useTourStore(state => state.loadTours);
  const loadTasks = useTourStore(state => state.loadTasks);

  useEffect(() => {
    setMounted(true);
    loadEmployees();
    loadResidents();
    loadTours();
    loadTasks();
  }, [loadEmployees, loadResidents, loadTours, loadTasks]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const activeResidents = residents.filter(r => r.status === 'active').length;
  const weekStart = getWeekStart();
  const weekEnd = getWeekEnd();
  const toursThisWeek = tours.filter(t => {
    const tourDate = new Date(t.date);
    return tourDate >= weekStart && tourDate <= weekEnd;
  }).length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Übersicht für die Woche vom {formatDate(weekStart)} bis {formatDate(weekEnd)}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Aktive Mitarbeiter"
            value={activeEmployees}
            color="blue"
            href="/mitarbeiter"
          />
          <StatCard
            icon={<Home className="w-6 h-6" />}
            title="Aktive Bewohner"
            value={activeResidents}
            color="green"
            href="/bewohner"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            title="Touren diese Woche"
            value={toursThisWeek}
            color="purple"
            href="/touren"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Erledigte Aufgaben"
            value={completedTasks}
            color="green"
            href="/touren"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Aktuelle Statistiken
            </h2>
            <div className="space-y-3">
              <StatRow label="Offene Aufgaben" value={pendingTasks} />
              <StatRow label="Abgeschlossene Aufgaben" value={completedTasks} />
              <StatRow label="Touren geplant" value={toursThisWeek} />
              <StatRow label="Mitarbeiter verfügbar" value={activeEmployees} />
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-600" />
              Schnellzugriff
            </h2>
            <div className="space-y-3">
              <QuickLink href="/touren" label="Neue Tour erstellen" />
              <QuickLink href="/mitarbeiter" label="Mitarbeiter hinzufügen" />
              <QuickLink href="/bewohner" label="Bewohner hinzufügen" />
              <QuickLink href="/touren" label="Wochenplan ansehen" />
            </div>
          </div>
        </div>

        {employees.length === 0 && residents.length === 0 && (
          <div className="card mt-8 bg-primary-50 border border-primary-200">
            <h3 className="text-lg font-bold text-primary-900 mb-2">
              Willkommen bei Pflege-Touren! 🎉
            </h3>
            <p className="text-primary-700 mb-4">
              Starte mit dem Anlegen von Mitarbeitern und Bewohnern, um die Tourenplanung zu nutzen.
            </p>
            <div className="flex gap-4">
              <Link href="/mitarbeiter" className="btn-primary">
                Mitarbeiter anlegen
              </Link>
              <Link href="/bewohner" className="btn-secondary">
                Bewohner anlegen
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  color, 
  href 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: number;
  color: 'blue' | 'green' | 'purple';
  href: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Link href={href} className="card hover:shadow-xl transition-shadow group">
      <div className={`${colorClasses[color]} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </Link>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href}
      className="block py-2 px-3 rounded-lg hover:bg-primary-50 transition-colors text-gray-700 hover:text-primary-700"
    >
      {label} →
    </Link>
  );
}

