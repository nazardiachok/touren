import Link from 'next/link';
import { Calendar, Users, Home, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-primary-900 mb-4">
            🏥 Pflege-Touren
          </h1>
          <p className="text-xl text-primary-700 mb-8">
            KI-gestütztes Tourenplanungssystem für die Pflege
          </p>
          <Link
            href="/dashboard"
            className="inline-block btn-primary text-lg px-8 py-3"
          >
            Zum Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Calendar className="w-8 h-8" />}
            title="Tourenplanung"
            description="Wochenansicht mit Drag & Drop Editor"
            href="/touren"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Mitarbeiter"
            description="Qualifikationen & Verfügbarkeit verwalten"
            href="/mitarbeiter"
          />
          <FeatureCard
            icon={<Home className="w-8 h-8" />}
            title="Bewohner"
            description="Pflegebedarf & Medikamente dokumentieren"
            href="/bewohner"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Dashboard"
            description="Übersicht & Statistiken"
            href="/dashboard"
          />
        </div>

        <div className="mt-16 card max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Features Phase 1 (MVP)</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>📅 Wochenansicht mit allen Touren</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>👥 Mitarbeiter-Management mit Qualifikationen</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>🏠 Bewohner-Verwaltung mit Pflegebedarf</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>✏️ Manueller Touren-Editor</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>💾 Offline-Speicherung (LocalStorage)</span>
            </li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">Geplant für Phase 2+</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">○</span>
              <span>🤖 KI-gestützte automatische Optimierung</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">○</span>
              <span>🔄 Auto-Umplanung bei Krankmeldungen</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">○</span>
              <span>🎤 Voice-Assistent für Mitarbeiter</span>
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-2">○</span>
              <span>📱 Mobile Apps (iOS & Android)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  href 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  href: string;
}) {
  return (
    <Link href={href} className="card hover:shadow-xl transition-shadow group">
      <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Link>
  );
}

