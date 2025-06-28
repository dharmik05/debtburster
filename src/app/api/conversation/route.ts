// import { OpenAIStream, StreamingTextResponse } from 'ai/responders';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request. 'messages' must be an array." }, { status: 400 });
    }

    // const response = await openai.chat.completions.create({
    //   model: 'gpt-4', // or 'gpt-3.5-turbo' if you want
    //   messages,
    //   temperature: 0.7,
    //   stream: true,
    // });

    // const stream = OpenAIStream(response);
    // return new StreamingTextResponse(stream);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
    });
    return NextResponse.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
