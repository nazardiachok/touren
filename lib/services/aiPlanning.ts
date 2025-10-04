import type { CreateTourInput, Employee, Resident, Tour } from '@/lib/types';
import { format } from 'date-fns';

export interface PlanningContext {
  date: string;
  employees: Employee[];
  residents: Resident[];
  existingTours: Tour[];
  constraints?: {
    maxHoursPerEmployee?: number;
    preferredShifts?: Record<string, string>;
    unavailableEmployees?: string[];
    urgentResidents?: string[];
  };
}

export interface AIPlanningRequest {
  context: PlanningContext;
  action: 'create_full_plan' | 'optimize_existing' | 'handle_changes';
  changes?: {
    residentPreferences?: Array<{ residentId: string; preference: string }>;
    employeeSickness?: Array<{ employeeId: string; reason: string }>;
    additionalRequests?: string;
  };
}

export interface AIPlanningResponse {
  success: boolean;
  tours: CreateTourInput[];
  reasoning: string;
  warnings?: string[];
  statistics?: {
    totalEmployees: number;
    totalResidents: number;
    totalTours: number;
    averageTasksPerTour: number;
    estimatedDuration: string;
  };
}

/**
 * Bereitet den Kontext für die KI vor
 */
export function preparePlanningContext(
  date: Date,
  employees: Employee[],
  residents: Resident[],
  existingTours: Tour[]
): PlanningContext {
  return {
    date: format(date, 'yyyy-MM-dd'),
    employees: employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      qualifications: emp.qualifications,
      availability: emp.availability,
      maxHoursPerWeek: emp.maxHoursPerWeek,
      contactInfo: emp.contactInfo,
      createdAt: emp.createdAt,
      updatedAt: emp.updatedAt,
    } as Employee)),
    residents: residents.map(res => ({
      id: res.id,
      name: res.name,
      careLevel: res.careLevel,
      requirements: res.requirements,
      address: res.address,
      preferences: res.preferences,
      medicalInfo: res.medicalInfo,
      contactInfo: res.contactInfo,
      emergencyContact: res.emergencyContact,
      insuranceInfo: res.insuranceInfo,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    } as Resident)),
    existingTours,
  };
}

/**
 * Erstellt den Prompt für die KI
 */
export function buildPlanningPrompt(request: AIPlanningRequest): string {
  const { context, action, changes } = request;

  let prompt = `Du bist ein KI-Assistent für Pflegedienst-Tourenplanung.

**Datum:** ${context.date}

**Verfügbare Mitarbeiter (${context.employees.length}):**
${context.employees.map((emp, idx) => `
${idx + 1}. ${emp.name} (ID: ${emp.id})
   - Qualifikationen: ${emp.qualifications.join(', ')}
   - Max. Stunden/Woche: ${emp.maxHoursPerWeek}h
   - Verfügbarkeit: ${emp.availability.days.join(', ')} | ${emp.availability.shifts.join(', ')}
`).join('\n')}

**Bewohner mit Pflegebedarf (${context.residents.length}):**
${context.residents.map((res, idx) => `
${idx + 1}. ${res.name} (ID: ${res.id})
   - Pflegegrad: ${res.careLevel}
   - Adresse: ${res.address.street} ${res.address.houseNumber}, ${res.address.zipCode} ${res.address.city}
   - Pflegebedarf: ${res.requirements.map(r => `${r.type} (${r.frequency}, ${r.estimatedDuration}min)`).join(', ')}
   - Präferenzen: ${res.preferences.timeOfDay.join(', ')} | Bevorzugte Mitarbeiter: ${res.preferences.preferredEmployees?.join(', ') || 'keine'}
   ${res.medicalInfo.medications && res.medicalInfo.medications.length > 0 ? `- Medikamente: ${res.medicalInfo.medications.map(m => m.name).join(', ')}` : ''}
`).join('\n')}

`;

  if (action === 'create_full_plan') {
    prompt += `
**AUFGABE:** Erstelle einen vollständigen Tourenplan für ${context.date}.

**Anforderungen:**
1. Alle Bewohner müssen besucht werden
2. Qualifikationen der Mitarbeiter müssen zu den Pflegebedürfnissen passen
3. Berücksichtige geografische Nähe (gleiche PLZ = weniger Fahrzeit)
4. Respektiere Bewohner-Präferenzen (Tageszeit, bevorzugte Mitarbeiter)
5. Plane realistische Fahrtzeiten zwischen Einsätzen ein (5-10 Min)
6. Maximale Arbeitszeit pro Mitarbeiter: 8 Stunden
7. Frühschicht: 6:00-14:00, Spätschicht: 14:00-22:00

**Output-Format (JSON):**
\`\`\`json
{
  "reasoning": "Kurze Erklärung der Planungsentscheidungen",
  "tours": [
    {
      "employeeId": "...",
      "date": "${context.date}",
      "shift": "early",
      "plannedStart": "06:30",
      "plannedEnd": "14:00",
      "tasks": [
        {
          "residentId": "...",
          "type": "koerperpflege",
          "scheduledTime": "2025-01-15T06:30:00.000Z",
          "estimatedDuration": 30,
          "notes": "Morgenpflege"
        }
      ]
    }
  ],
  "warnings": ["Optional: Warnungen falls Constraints nicht erfüllt werden können"]
}
\`\`\`
`;
  } else if (action === 'optimize_existing') {
    prompt += `
**AUFGABE:** Optimiere die bestehenden Touren.

**Bestehende Touren:**
${context.existingTours.map(tour => {
  const employee = context.employees.find(e => e.id === tour.employeeId);
  return `- ${employee?.name || 'Unbekannt'}: ${tour.tasks.length} Einsätze, ${tour.plannedStart}-${tour.plannedEnd}`;
}).join('\n')}

**Optimierungsziele:**
1. Reduziere Fahrtzeiten durch geografische Optimierung
2. Gleichmäßigere Verteilung der Arbeitsbelastung
3. Respektiere Bewohner-Präferenzen besser

Gib die optimierten Touren im gleichen JSON-Format zurück.
`;
  } else if (action === 'handle_changes') {
    prompt += `
**AUFGABE:** Passe die Planung an folgende Änderungen an:

${changes?.residentPreferences ? `**Bewohner-Wünsche:**
${changes.residentPreferences.map(p => `- ${context.residents.find(r => r.id === p.residentId)?.name}: ${p.preference}`).join('\n')}
` : ''}

${changes?.employeeSickness ? `**Mitarbeiter-Ausfälle:**
${changes.employeeSickness.map(s => `- ${context.employees.find(e => e.id === s.employeeId)?.name}: ${s.reason}`).join('\n')}
` : ''}

${changes?.additionalRequests ? `**Zusätzliche Anforderungen:**
${changes.additionalRequests}
` : ''}

Erstelle einen angepassten Tourenplan, der diese Änderungen berücksichtigt.
`;
  }

  return prompt;
}

/**
 * Parst die KI-Response
 */
export function parseAIResponse(response: string): AIPlanningResponse {
  try {
    // Extrahiere JSON aus Markdown-Code-Block falls vorhanden
    let jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    
    if (!jsonMatch) {
      jsonMatch = response.match(/```\n([\s\S]*?)\n```/);
    }
    
    if (!jsonMatch) {
      // Versuche JSON direkt zu finden (falls ohne Code-Block)
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonMatch = [response, response.substring(jsonStart, jsonEnd + 1)];
      }
    }
    
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    console.log('🔍 Parsing JSON, Länge:', jsonString.length);
    
    const parsed = JSON.parse(jsonString.trim());
    
    // Validiere Struktur
    if (!parsed.tours || !Array.isArray(parsed.tours)) {
      throw new Error('Keine gültige tours-Array gefunden');
    }
    
    console.log('✅ JSON erfolgreich geparst:', parsed.tours.length, 'Touren');
    
    return {
      success: true,
      tours: parsed.tours,
      reasoning: parsed.reasoning || 'Keine Erklärung vorhanden',
      warnings: parsed.warnings,
      statistics: parsed.statistics,
    };
  } catch (error) {
    console.error('❌ Failed to parse AI response:', error);
    console.error('Response snippet:', response.substring(0, 200));
    return {
      success: false,
      tours: [],
      reasoning: 'Fehler beim Parsen der KI-Antwort',
      warnings: [`Die KI-Antwort konnte nicht verarbeitet werden: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`],
    };
  }
}

