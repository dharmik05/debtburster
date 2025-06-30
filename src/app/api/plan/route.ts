import { NextResponse } from "next/server";
import {OpenAI} from "openai"

import { generateDebtPlanPrompt } from "@/utils/aiPrompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try{
    const { debts, userProfile } = await req.json();
    const prompt = generateDebtPlanPrompt(debts, userProfile);
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });
  
  
      const plan = response.choices[0].message.content;
  
      return NextResponse.json({ plan });
    } catch (error) {
      return NextResponse.json("Error generating response", { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
  }
}