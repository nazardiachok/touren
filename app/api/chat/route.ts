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

    // Erstelle Input-String für GPT-5 responses API
    const systemContext = `Du bist ein KI-Assistent für ein Pflegedienst-Tourenplanungssystem.

Du hast Zugriff auf folgende Daten:
- ${context?.residents?.length || 0} Bewohner
- ${context?.employees?.length || 0} Mitarbeiter  
- ${context?.tours?.length || 0} Touren

Antworte auf Deutsch, freundlich und professionell. Sei präzise und hilfreich.`;

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
