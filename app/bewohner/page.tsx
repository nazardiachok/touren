'use client';

import { useResidentStore } from '@/lib/store/residentStore';
import type { Resident } from '@/lib/types';
import { getCareLevelLabel } from '@/lib/utils/helpers';
import { Heart, Home as HomeIcon, Phone, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BewohnerPage() {
  const [mounted, setMounted] = useState(false);
  const residents = useResidentStore(state => state.residents);
  const loadResidents = useResidentStore(state => state.loadResidents);

  useEffect(() => {
    setMounted(true);
    loadResidents();
  }, [loadResidents]);

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
              <h1 className="text-3xl font-bold text-gray-900">Bewohner</h1>
              <p className="text-gray-600 mt-1">{residents.length} Bewohner registriert</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Bewohner hinzufügen
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {residents.length === 0 ? (
          <div className="card text-center py-12">
            <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Keine Bewohner vorhanden</h3>
            <p className="text-gray-600 mb-6">Füge deinen ersten Bewohner hinzu.</p>
            <button className="btn-primary">
              Ersten Bewohner hinzufügen
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residents.map(resident => (
              <ResidentCard key={resident.id} resident={resident} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResidentCard({ resident }: { resident: Resident }) {
  const age = new Date().getFullYear() - new Date(resident.dateOfBirth).getFullYear();

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{resident.name}</h3>
          <p className="text-sm text-gray-600">{age} Jahre</p>
          <span className="badge badge-blue mt-2">
            {getCareLevelLabel(resident.careLevel)}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-start text-gray-600">
          <HomeIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>
            {resident.address.street} {resident.address.houseNumber}<br />
            {resident.address.zipCode} {resident.address.city}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {resident.contact.phone}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 mb-2">Pflegebedarf</h4>
        <div className="flex flex-wrap gap-1">
          {resident.requirements.slice(0, 3).map((req, i) => (
            <span key={i} className="badge badge-green text-xs">
              {req.type}
            </span>
          ))}
          {resident.requirements.length > 3 && (
            <span className="badge badge-gray text-xs">
              +{resident.requirements.length - 3} weitere
            </span>
          )}
        </div>
      </div>

      {resident.medicalInfo.allergies.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-red-700 font-medium">
              Allergien: {resident.medicalInfo.allergies.join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

