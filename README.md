# 🏥 Pflege-Touren - KI-gestütztes Tourenplanungssystem

## 📖 Was ist Pflege-Touren?

**Pflege-Touren** ist ein innovatives, KI-gestütztes Tourenplanungssystem, das speziell für die **ambulante und stationäre Pflege** entwickelt wurde. Die App löst eines der größten Probleme in der Pflegebranche: die zeitaufwändige, komplexe und fehleranfällige **manuelle Tourenplanung**.

### 🎯 Das Problem

In der Pflege müssen täglich Hunderte von Entscheidungen getroffen werden:
- Welcher Mitarbeiter hat die richtigen **Qualifikationen** für einen Bewohner?
- Wer ist **verfügbar** und hat noch Kapazität?
- Wie plant man **effiziente Routen**, um Zeit zu sparen?
- Was passiert bei **Krankmeldungen** oder **Absagen**?
- Wie dokumentiert man alles **DSGVO-konform**?

**Aktuell**: Diese Planung erfolgt meist **manuell** mit Excel, Whiteboards oder veralteten Systemen. Das kostet **Stunden pro Woche** und führt zu:
- ❌ Ineffizienten Routen (verschwendete Fahrzeit)
- ❌ Falsche Qualifikations-Zuordnungen
- ❌ Stress bei Notfällen und Umplanungen
- ❌ Fehlende Transparenz für Mitarbeiter
- ❌ Keine Optimierungsvorschläge

### 💡 Die Lösung: Pflege-Touren

Unsere App automatisiert und optimiert den gesamten Prozess:

1. **Intelligente Planung** 🧠
   - KI schlägt **optimale Touren** vor basierend auf:
     - Mitarbeiter-Qualifikationen
     - Bewohner-Anforderungen (Medikamente, Pflege, etc.)
     - Verfügbarkeit & Arbeitszeiten
     - Geografische Nähe (kürzeste Routen)
     - Präferenzen (Bewohner bevorzugt bestimmte Pflegekräfte)

2. **Automatische Umplanung** 🔄
   - Bei Krankmeldung: KI findet **sofort Ersatz**
   - Bei Absagen: Lücken werden **intelligent gefüllt**
   - Konflikte werden **automatisch erkannt** und gelöst
   - Mitarbeiter dürfen nur bei **wichtigem Grund** widersprechen

3. **Mobile-First für Pflegekräfte** 📱
   - Jeder Mitarbeiter hat eine **eigene App**
   - **Tagesplan** mit allen Details zu Bewohnern
   - **Voice-Assistent** (Kopfhörer): "Was braucht Frau Müller?"
   - **Real-time Updates** bei Änderungen
   - **Offline-fähig** für unterwegs

4. **Zentrale Verwaltung** 💻
   - **Wochenübersicht** für Pflegedienstleitung
   - **Drag & Drop** Touren-Editor
   - **Reporting & Analytics**
   - **Export** für Abrechnungen

### 🌟 Einzigartige Features

#### 🤖 KI-Assistent
- **Qualifikations-Matching**: Nur berechtigte Mitarbeiter für Medikamente, Insulin, Wundversorgung
- **Zeitoptimierung**: Minimale Fahrzeiten, maximale Effizienz
- **Lernende KI**: System lernt aus vergangenen Touren und wird immer besser

#### 🎤 Voice-Interface
- Mitarbeiter können **während der Fahrt** oder **mit Handschuhen** die KI fragen:
  - "Welche Medikamente braucht Herr Schmidt?"
  - "Was ist bei Frau Müller zu beachten?"
  - "Ich bin fertig bei Bewohner X, was kommt als nächstes?"

#### ⚡ Echtzeit-Reaktion
- Krankmeldung um 6 Uhr morgens → KI plant in **Sekunden** um
- Tour wird abgesagt → Andere Mitarbeiter werden **sofort informiert**
- Notfall → System reagiert **automatisch**

### 🎯 Ziele des Projekts

#### Kurzfristig (Phase 1 - MVP) ✅
- ✅ **Grundlegende Tourenplanung** ohne KI
- ✅ Mitarbeiter- & Bewohner-Verwaltung
- ✅ Wochenkalender-Ansicht
- ✅ **Manuelle Planung** möglich
- ✅ LocalStorage (Offline im Browser)

#### Mittelfristig (Phase 2-3) 🔜
- 🔄 **KI-Integration** (OpenAI GPT-4)
  - Automatische Tourenoptimierung
  - Intelligente Vorschläge
  - Auto-Rescheduling
- 🎤 **Voice-Assistent** (Whisper + GPT)
  - Spracherkennung Deutsch
  - Kontextbewusstes Frage-Antwort
  - Hands-free Bedienung
- 📱 **Mobile Apps** (iOS & Android)
  - React Native
  - Push-Benachrichtigungen
  - Offline-Sync
- 🔐 **Backend API** (NestJS + PostgreSQL)
  - Multi-User Support
  - Echtzeit-Synchronisation
  - Rollen & Rechte

#### Langfristig (Phase 4+) 🚀
- 📊 **Predictive Analytics**
  - "Welcher Bewohner braucht wahrscheinlich mehr Zeit?"
  - "Welche Mitarbeiter werden wahrscheinlich krank?"
  - Optimale Pausenzeiten
- 🌐 **Multi-Standort Support**
  - Mehrere Pflegeeinrichtungen
  - Zentrale Verwaltung
  - Standort-übergreifende Planung
- 💰 **Abrechnungs-Integration**
  - Automatische Zeiterfassung
  - Export für Krankenkassen
  - Compliance-Checks
- 🔗 **Drittsystem-Integration**
  - Pflegesoftware (Vivendi, etc.)
  - Zeiterfassungssysteme
  - Abrechnungssysteme

### 👥 Zielgruppe

- **Ambulante Pflegedienste** (5-500 Mitarbeiter)
- **Stationäre Pflegeeinrichtungen** (Altenheime, Seniorenresidenzen)
- **Tagespflege-Einrichtungen**
- **Intensivpflege-Dienste**

### 💼 Business Model (Geplant)

```
Freemium Modell:
├── Kostenlos: Bis 5 Mitarbeiter (Basic Features)
├── Professional: €50-100/Mitarbeiter/Monat (KI + Voice)
└── Enterprise: Custom Pricing (Multi-Standort, API)
```

### 🔐 Datenschutz (DSGVO-konform)

- ✅ Ende-zu-Ende-Verschlüsselung
- ✅ Server in Deutschland (später)
- ✅ Audit-Logs für alle Aktionen
- ✅ Right to be forgotten
- ✅ Consent-Management

### 🌍 Vision

**"Pflege-Touren soll DIE Standard-Software für Tourenplanung in der Pflege werden und Pflegekräften mehr Zeit für das Wesentliche geben: Die Menschen."**

Wir wollen:
- 🕐 **30% Zeitersparnis** bei der Planung
- 🚗 **20% weniger Fahrzeit** durch optimierte Routen
- 😊 **Höhere Zufriedenheit** bei Pflegekräften und Bewohnern
- 📈 **Bessere Qualität** durch richtige Qualifikations-Zuordnung

---

## 🎯 Features (Phase 1 - Web MVP)

### ✅ Implementiert

- 📅 **Wochenansicht** - Kompletter Tourenplan für die Woche
- 👥 **Mitarbeiter-Management** - Qualifikationen, Verfügbarkeit, Arbeitszeiten
- 🏠 **Bewohner-Management** - Pflegebedarf, Medikamente, Präferenzen
- ✏️ **Touren-Editor** - Drag & Drop, Zeitplanung, Aufgabenzuweisung
- 💾 **LocalStorage** - Alle Daten offline im Browser gespeichert
- 🎨 **Modernes UI** - Responsive Design mit Tailwind CSS
- ✅ **Test-Coverage** - Vitest + Testing Library

### 🚧 Geplant (Phase 2+)

- 🤖 **KI-Optimierung** - Automatische Tourenplanung
- 🔄 **Auto-Umplanung** - Bei Krankmeldungen & Absagen
- 🎤 **Voice-Assistent** - Kopfhörer-Integration für Mitarbeiter
- 📱 **Mobile Apps** - iOS & Android (React Native)
- 🔐 **Backend API** - NestJS mit PostgreSQL

## 🏗️ Tech-Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Testing**: Vitest + React Testing Library
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🚀 Quick Start

```bash
# Installation
npm install

# Development Server (http://localhost:3000)
npm run dev

# Tests
npm test

# Type Check
npm run type-check

# Production Build
npm run build
npm start
```

## 📁 Projekt-Struktur

```
Touren/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Login/Register
│   ├── dashboard/               # Hauptansicht
│   ├── touren/                  # Tourenplanung
│   ├── mitarbeiter/             # Mitarbeiter-Verwaltung
│   ├── bewohner/                # Bewohner-Verwaltung
│   ├── layout.tsx               # Root Layout
│   └── page.tsx                 # Landing Page
├── components/                   # React Komponenten
│   ├── touren/                  # Touren-spezifisch
│   ├── mitarbeiter/             # Mitarbeiter-spezifisch
│   ├── bewohner/                # Bewohner-spezifisch
│   └── ui/                      # Wiederverwendbare UI
├── lib/                         # Core Logic
│   ├── store/                   # Zustand Stores
│   ├── services/                # LocalStorage Services
│   ├── types/                   # TypeScript Types
│   └── utils/                   # Helper Functions
├── tests/                       # Test Files
└── public/                      # Static Assets
```

## 🗄️ Datenmodell

```typescript
Employee {
  id: string
  name: string
  qualifications: Qualification[]  // Medikamente, Wundversorgung, etc.
  availability: Schedule
  maxHoursPerDay: number
  contact: ContactInfo
}

Resident {
  id: string
  name: string
  address: Address
  careLevel: 1-5
  requirements: CareTask[]  // Tabletten, Körperpflege, etc.
  preferences: Preferences
  medicalInfo: MedicalRecord
}

Tour {
  id: string
  employeeId: string
  date: Date
  shift: 'early' | 'late' | 'night'
  tasks: Task[]
  status: 'planned' | 'active' | 'completed'
}

Task {
  id: string
  residentId: string
  type: TaskType
  scheduledTime: DateTime
  estimatedDuration: minutes
  requiredQualification: Qualification
  status: 'pending' | 'in_progress' | 'completed'
  notes: string
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage

# UI Mode
npm run test:ui
```

## 📝 Development Guidelines

1. **TypeScript First** - Alle Dateien in TypeScript
2. **No Comments in Production** - Code soll selbsterklärend sein
3. **Component Structure** - Kleine, wiederverwendbare Komponenten
4. **Test Coverage** - Mindestens 80% für kritische Features
5. **Responsive Design** - Mobile-First Approach

## 🎨 Design-System

### Farben
- **Primary**: Blau (#3b82f6) - Hauptaktionen
- **Medical Red**: (#ef4444) - Notfälle, kritische Tasks
- **Medical Green**: (#10b981) - Erfolg, abgeschlossen
- **Medical Yellow**: (#f59e0b) - Warnungen
- **Shift Colors**: 
  - Frühschicht: Gelb
  - Spätschicht: Orange
  - Nachtschicht: Lila

### Typography
- **Font Family**: Geist Sans (Primary), Geist Mono (Code)
- **Sizes**: Tailwind Standard Scale

## 📄 Lizenz

Proprietary - Alle Rechte vorbehalten

## 👨‍💻 Autor

Entwickelt für moderne Pflegeeinrichtungen

