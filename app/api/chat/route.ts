import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API Key nicht konfiguriert' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array erforderlich' },
        { status: 400 }
      );
    }

    // Model auswählen (GPT-5)
    const model = process.env.OPENAI_CHAT_MODEL || 'gpt-5';

    console.log('💬 Chat-Anfrage:', {
      model,
      messages: messages.length,
      context: !!context,
    });

    // Erstelle detaillierten System-Context mit ALLEN Daten
    const systemContext = `Du bist ein KI-Assistent für ein Pflegedienst-Tourenplanungssystem.

WICHTIG: Antworte NUR auf Basis der bereitgestellten Daten. Erfinde KEINE Informationen!

=== BEWOHNER (${context?.residents?.length || 0}) ===
${context?.residents?.map((res: any, idx: number) => `
${idx + 1}. ${res.name} (ID: ${res.id})
   - Pflegegrad: ${res.careLevel}
   - Adresse: ${res.address?.street} ${res.address?.houseNumber}, ${res.address?.zipCode} ${res.address?.city}
   - Telefon: ${res.contactInfo?.phone || 'keine'}
   - Pflegebedarf: ${res.requirements?.map((r: any) => `${r.type} (${r.frequency}, ${r.estimatedDuration}min, Qualifikation: ${r.requiredQualification})`).join(', ') || 'keine'}
   - Präferenzen: Tageszeit: ${res.preferences?.timeOfDay?.join(', ') || 'keine'}, Bevorzugte Mitarbeiter: ${res.preferences?.preferredEmployees?.join(', ') || 'keine'}
   - Medizinische Infos:
     * Allergien: ${res.medicalInfo?.allergies?.join(', ') || 'keine'}
     * Diagnosen: ${res.medicalInfo?.diagnoses?.join(', ') || 'keine'}
     * Medikamente: ${res.medicalInfo?.medications?.map((m: any) => `${m.name} (${m.dosage}, ${m.frequency})`).join(', ') || 'keine'}
     * Einschränkungen: ${res.medicalInfo?.mobility || 'keine'}
   - Notfallkontakt: ${res.emergencyContact?.name || 'keine'} (${res.emergencyContact?.phone || ''})
`).join('\n') || 'Keine Bewohner vorhanden'}

=== MITARBEITER (${context?.employees?.length || 0}) ===
${context?.employees?.map((emp: any, idx: number) => `
${idx + 1}. ${emp.name} (ID: ${emp.id})
   - Qualifikationen: ${emp.qualifications?.join(', ') || 'keine'}
   - Verfügbarkeit: ${emp.availability?.days?.join(', ') || 'keine Tage'} | Schichten: ${emp.availability?.shifts?.join(', ') || 'keine'}
   - Max. Stunden/Woche: ${emp.maxHoursPerWeek || 'nicht angegeben'}h
   - Telefon: ${emp.contactInfo?.phone || 'keine'}
   - Email: ${emp.contactInfo?.email || 'keine'}
`).join('\n') || 'Keine Mitarbeiter vorhanden'}

=== TOUREN (${context?.tours?.length || 0}) ===
${context?.tours?.slice(0, 10).map((tour: any, idx: number) => {
  const employee = context?.employees?.find((e: any) => e.id === tour.employeeId);
  return `${idx + 1}. ${employee?.name || 'Unbekannt'} - ${tour.date} (${tour.shift}): ${tour.tasks?.length || 0} Einsätze`;
}).join('\n') || 'Keine Touren vorhanden'}

Antworte auf Deutsch, freundlich und professionell. Wenn du nach spezifischen Informationen gefragt wirst (z.B. Allergien eines Bewohners), gib NUR die Informationen aus den obigen Daten zurück.`;

    const conversationText = messages.map((msg: any) => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      return `${role}: ${msg.content}`;
    }).join('\n\n');

    const input = `${systemContext}\n\n${conversationText}`;

    // GPT-5 Responses API (wie in der offiziellen Doku)
    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
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

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('❌ OpenAI API Error:', errorData);
      return NextResponse.json(
        { error: 'OpenAI API Fehler', details: errorData },
        { status: openaiResponse.status }
      );
    }

    const data = await openaiResponse.json();
    
    console.log('✅ GPT-5 Response erhalten');
    
    // GPT-5 Response-Format: output[1].content[0].text
    let contentString = '';
    
    if (data.output && Array.isArray(data.output)) {
      // Finde das message-Objekt (type: "message")
      const messageOutput = data.output.find((item: any) => item.type === 'message');
      
      if (messageOutput && messageOutput.content && Array.isArray(messageOutput.content)) {
        // Finde den output_text content
        const textContent = messageOutput.content.find((c: any) => c.type === 'output_text');
        
        if (textContent && textContent.text) {
          contentString = textContent.text;
        }
      }
    }
    
    if (!contentString) {
      console.error('❌ Kein Text in Response gefunden');
      console.error('Response Struktur:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: 'Keine Antwort von OpenAI erhalten', details: data },
        { status: 500 }
      );
    }

    console.log('💬 Antwort:', contentString.substring(0, 100) + '...');

    // Erstelle message-kompatibles Format für Frontend
    const assistantMessage = {
      role: 'assistant',
      content: contentString,
    };

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      usage: data.usage,
    });

  } catch (error) {
    console.error('❌ Chat API Error:', error);
    return NextResponse.json(
      { 
        error: 'Interner Server-Fehler',
        message: error instanceof Error ? error.message : 'Unbekannter Fehler',
      },
      { status: 500 }
    );
  }
}
