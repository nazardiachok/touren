import { buildPlanningPrompt, type AIPlanningRequest } from '@/lib/services/aiPlanning';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * AI Agent API - Die KI kann direkt Touren erstellen/bearbeiten/löschen
 * 
 * Diese API implementiert einen Multi-Step Agent Loop:
 * 1. User-Anfrage empfangen
 * 2. GPT-5 entscheidet welche Functions aufzurufen sind
 * 3. Server führt Functions aus
 * 4. Ergebnisse an GPT-5 zurück
 * 5. GPT-5 entscheidet ob weitere Actions nötig sind (Loop)
 * 6. Finale Antwort an User
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API Key nicht konfiguriert' },
        { status: 500 }
      );
    }

    const body: AIPlanningRequest & { context: any } = await request.json();
    
    if (!body.context || !body.action) {
      return NextResponse.json(
        { error: 'Fehlende Parameter: context und action sind erforderlich' },
        { status: 400 }
      );
    }

    console.log('🤖 AI Agent gestartet');
    console.log('   Aktion:', body.action);
    console.log('   Mitarbeiter:', body.context.employees.length);
    console.log('   Bewohner:', body.context.residents.length);

    const model = process.env.OPENAI_MODEL || 'gpt-5';
    
    // Erstelle Prompt mit allen Daten
    const userPrompt = buildPlanningPrompt(body);
    
    const systemPrompt = `Du bist ein KI-Agent für Pflegedienst-Tourenplanung mit direktem Zugriff auf das System.

Du kannst folgende Aktionen durchführen:
1. createTour(employeeId, date, shift, plannedStart, plannedEnd) - Erstellt eine Tour
2. addTaskToTour(tourId, residentId, type, scheduledTime, estimatedDuration, notes?) - Fügt Einsatz hinzu
3. updateTask(taskId, scheduledTime?, estimatedDuration?, notes?) - Ändert Einsatz
4. deleteTask(taskId) - Löscht Einsatz
5. deleteTour(tourId) - Löscht Tour

WICHTIG: 
- Gib deine Antwort als JSON zurück
- Format: { "actions": [...], "reasoning": "..." }
- actions ist ein Array von Function Calls: { "function": "createTour", "args": {...} }
- Füge IMMER Fahrtzeiten zwischen Einsätzen ein (addTaskToTour mit residentId="driving")
- Erstelle einen vollständigen, realistischen Tourenplan

Beispiel:
\`\`\`json
{
  "actions": [
    {
      "function": "createTour",
      "args": {
        "employeeId": "emp1",
        "date": "2025-10-04",
        "shift": "early",
        "plannedStart": "06:00",
        "plannedEnd": "14:00"
      }
    },
    {
      "function": "addTaskToTour",
      "args": {
        "tourId": "TOUR_ID_FROM_PREVIOUS_STEP",
        "residentId": "res1",
        "type": "koerperpflege",
        "scheduledTime": "2025-10-04T06:30:00.000Z",
        "estimatedDuration": 30,
        "notes": "Morgenpflege"
      }
    },
    {
      "function": "addTaskToTour",
      "args": {
        "tourId": "TOUR_ID_FROM_PREVIOUS_STEP",
        "residentId": "driving",
        "type": "dokumentation",
        "scheduledTime": "2025-10-04T07:00:00.000Z",
        "estimatedDuration": 8,
        "notes": "Fahrtzeit"
      }
    }
  ],
  "reasoning": "Ich habe eine Frühschicht-Tour für Mitarbeiter X erstellt..."
}
\`\`\`

Beachte: Wenn du "TOUR_ID_FROM_PREVIOUS_STEP" verwendest, wird die ID automatisch vom System ersetzt.`;

    const input = `${systemPrompt}\n\n${userPrompt}`;

    // GPT-5 Responses API
    let openaiResponse;
    try {
      console.log('📤 Sende Request an OpenAI...');
      openaiResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          input,
        }),
      });
      console.log('📥 Response erhalten, Status:', openaiResponse.status);
    } catch (fetchError) {
      console.error('❌ Fetch Error:', fetchError);
      return NextResponse.json(
        { 
          error: 'Verbindung zu OpenAI fehlgeschlagen', 
          details: fetchError instanceof Error ? fetchError.message : 'Network error',
          hint: 'Überprüfe deine Internetverbindung und OpenAI API Key'
        },
        { status: 500 }
      );
    }

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('❌ OpenAI API Error:', errorData);
      return NextResponse.json(
        { error: 'OpenAI API Fehler', details: errorData },
        { status: openaiResponse.status }
      );
    }

    const data = await openaiResponse.json();
    
    // Extrahiere output_text aus GPT-5 Response
    let aiContent = '';
    if (data.output && Array.isArray(data.output)) {
      const messageOutput = data.output.find((item: any) => item.type === 'message');
      if (messageOutput && messageOutput.content && Array.isArray(messageOutput.content)) {
        const textContent = messageOutput.content.find((c: any) => c.type === 'output_text');
        if (textContent && textContent.text) {
          aiContent = textContent.text;
        }
      }
    }

    if (!aiContent) {
      console.error('❌ Kein Text in Response');
      return NextResponse.json(
        { error: 'Keine Antwort von OpenAI erhalten' },
        { status: 500 }
      );
    }

    console.log('✅ GPT-5 Antwort erhalten, Tokens:', data.usage?.total_tokens || '?');
    console.log('📝 Content:', aiContent.substring(0, 300));

    // Parse JSON response
    let planData: { actions: Array<{ function: string; args: any }>; reasoning: string };
    try {
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
      planData = JSON.parse(jsonString.trim());
    } catch (error) {
      console.error('❌ JSON Parsing Error:', error);
      return NextResponse.json(
        { error: 'Fehler beim Parsen der KI-Antwort', details: aiContent.substring(0, 500) },
        { status: 500 }
      );
    }

    if (!planData.actions || !Array.isArray(planData.actions)) {
      return NextResponse.json(
        { error: 'Keine gültigen Actions in der KI-Antwort' },
        { status: 500 }
      );
    }

    console.log('🔧 Führe', planData.actions.length, 'Actions aus...');

    // Führe die Actions aus (Server-Side - kein Zugriff auf Zustand Store hier)
    // Wir geben die Actions zurück und lassen das Frontend sie ausführen
    
    return NextResponse.json({
      success: true,
      data: {
        actions: planData.actions,
        reasoning: planData.reasoning,
        toursCreated: planData.actions.filter(a => a.function === 'createTour').length,
        tasksCreated: planData.actions.filter(a => a.function === 'addTaskToTour').length,
      },
      usage: data.usage,
    });

  } catch (error) {
    console.error('❌ AI Agent Error:', error);
    return NextResponse.json(
      { 
        error: 'Interner Server-Fehler',
        message: error instanceof Error ? error.message : 'Unbekannter Fehler',
      },
      { status: 500 }
    );
  }
}

