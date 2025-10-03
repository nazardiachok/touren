import { buildPlanningPrompt, parseAIResponse, type AIPlanningRequest, type AIPlanningResponse } from '@/lib/services/aiPlanning';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Optional: Edge Runtime für schnellere Responses

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API Key nicht konfiguriert' },
        { status: 500 }
      );
    }

    const body: AIPlanningRequest = await request.json();
    
    // Validierung
    if (!body.context || !body.action) {
      return NextResponse.json(
        { error: 'Fehlende Parameter: context und action sind erforderlich' },
        { status: 400 }
      );
    }

    // Prompt erstellen
    const prompt = buildPlanningPrompt(body);
    
    console.log('🤖 Sende Anfrage an OpenAI...');
    console.log('   Mitarbeiter:', body.context.employees.length);
    console.log('   Bewohner:', body.context.residents.length);
    console.log('   Aktion:', body.action);

    // Model auswählen
    const model = process.env.OPENAI_MODEL || 'gpt-5';
    
    const systemPrompt = 'Du bist ein Experte für Pflegedienst-Tourenplanung. Du gibst IMMER valides JSON zurück, eingeschlossen in ```json Code-Blöcken.';
    
    const input = `${systemPrompt}\n\n${prompt}`;
    
    // GPT-5 Responses API
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
    
    // GPT-5 Response-Format: output[1].content[0].text
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
      console.error('❌ Kein Text in Response gefunden:', data);
      return NextResponse.json(
        { error: 'Keine Antwort von OpenAI erhalten', details: data },
        { status: 500 }
      );
    }

    console.log('✅ GPT-5 Antwort erhalten');
    console.log('   Tokens verwendet:', data.usage?.total_tokens || 'unbekannt');

    // Parse AI Response
    const planningResponse: AIPlanningResponse = parseAIResponse(aiContent);

    if (!planningResponse.success) {
      return NextResponse.json(
        { 
          error: 'Fehler beim Parsen der KI-Antwort',
          details: planningResponse.warnings,
          rawResponse: aiContent,
        },
        { status: 500 }
      );
    }

    console.log('✅ Tourenplan erstellt:');
    console.log('   Touren:', planningResponse.tours.length);
    console.log('   Reasoning:', planningResponse.reasoning);

    return NextResponse.json({
      success: true,
      data: planningResponse,
      usage: data.usage,
    });

  } catch (error) {
    console.error('Fehler bei AI Planning:', error);
    return NextResponse.json(
      { 
        error: 'Interner Server-Fehler',
        message: error instanceof Error ? error.message : 'Unbekannter Fehler',
      },
      { status: 500 }
    );
  }
}

