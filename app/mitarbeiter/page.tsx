'use client';

import { useEmployeeStore } from '@/lib/store/employeeStore';
import type { CreateEmployeeInput, Employee, Qualification } from '@/lib/types';
import { getQualificationLabel } from '@/lib/utils/helpers';
import { validateEmployee } from '@/lib/utils/validation';
import { Calendar, Edit2, Phone, Plus, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MitarbeiterPage() {
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const employees = useEmployeeStore(state => state.employees);
  const loadEmployees = useEmployeeStore(state => state.loadEmployees);

  useEffect(() => {
    setMounted(true);
    loadEmployees();
  }, [loadEmployees]);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mitarbeiter</h1>
              <p className="text-gray-600 mt-1">{employees.length} Mitarbeiter registriert</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Mitarbeiter hinzufügen
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {employees.length === 0 ? (
          <div className="card text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Keine Mitarbeiter vorhanden</h3>
            <p className="text-gray-600 mb-6">Füge deinen ersten Mitarbeiter hinzu, um mit der Tourenplanung zu starten.</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Ersten Mitarbeiter hinzufügen
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(employee => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <EmployeeFormModal onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function EmployeeCard({ employee }: { employee: Employee }) {
  const deleteEmployee = useEmployeeStore(state => state.deleteEmployee);
  const setEmployeeStatus = useEmployeeStore(state => state.setEmployeeStatus);

  const handleDelete = () => {
    if (confirm(`Mitarbeiter ${employee.name} wirklich löschen?`)) {
      deleteEmployee(employee.id);
    }
  };

  const getStatusColor = (status: Employee['status']) => {
    const colors = {
      active: 'badge-green',
      sick: 'badge-red',
      vacation: 'badge-yellow',
      inactive: 'badge-gray',
    };
    return colors[status];
  };

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{employee.name}</h3>
          <span className={`badge ${getStatusColor(employee.status)} mt-2`}>
            {employee.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={handleDelete} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {employee.contact.phone}
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          Max. {employee.maxHoursPerDay} Std/Tag
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 mb-2">Qualifikationen</h4>
        <div className="flex flex-wrap gap-1">
          {employee.qualifications.map(qual => (
            <span key={qual} className="badge badge-blue text-xs">
              {getQualificationLabel(qual)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmployeeFormModal({ onClose }: { onClose: () => void }) {
  const addEmployee = useEmployeeStore(state => state.addEmployee);
  const [formData, setFormData] = useState<Partial<CreateEmployeeInput>>({
    name: '',
    qualifications: [],
    maxHoursPerDay: 8,
    contact: { phone: '', email: '' },
    availability: {
      monday: [{ start: '08:00', end: '16:00' }],
      tuesday: [{ start: '08:00', end: '16:00' }],
      wednesday: [{ start: '08:00', end: '16:00' }],
      thursday: [{ start: '08:00', end: '16:00' }],
      friday: [{ start: '08:00', end: '16:00' }],
      saturday: [],
      sunday: [],
    }
  });
  const [errors, setErrors] = useState<string[]>([]);

  const allQualifications: Qualification[] = [
    'grundpflege',
    'medikamente',
    'wundversorgung',
    'behandlungspflege',
    'demenzbetreuung',
    'palliativpflege',
    'insulinverabreichung',
  ];

  const toggleQualification = (qual: Qualification) => {
    const current = formData.qualifications || [];
    const updated = current.includes(qual)
      ? current.filter(q => q !== qual)
      : [...current, qual];
    setFormData({ ...formData, qualifications: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateEmployee(formData as CreateEmployeeInput);
    if (validationErrors.length > 0) {
      setErrors(validationErrors.map(e => e.message));
      return;
    }

    addEmployee(formData as CreateEmployeeInput);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Neuer Mitarbeiter</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              {errors.map((error, i) => (
                <p key={i} className="text-red-800 text-sm">{error}</p>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Max Mustermann"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon *
              </label>
              <input
                type="tel"
                className="input-field"
                value={formData.contact?.phone}
                onChange={e => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact!, phone: e.target.value }
                })}
                placeholder="+49 123 456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail (optional)
              </label>
              <input
                type="email"
                className="input-field"
                value={formData.contact?.email}
                onChange={e => setFormData({ 
                  ...formData, 
                  contact: { ...formData.contact!, email: e.target.value }
                })}
                placeholder="max@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max. Stunden pro Tag *
              </label>
              <input
                type="number"
                min="1"
                max="12"
                className="input-field"
                value={formData.maxHoursPerDay}
                onChange={e => setFormData({ ...formData, maxHoursPerDay: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifikationen * (mindestens eine)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {allQualifications.map(qual => (
                  <label key={qual} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.qualifications?.includes(qual)}
                      onChange={() => toggleQualification(qual)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-sm">{getQualificationLabel(qual)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Abbrechen
            </button>
            <button type="submit" className="btn-primary flex-1">
              Mitarbeiter hinzufügen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

