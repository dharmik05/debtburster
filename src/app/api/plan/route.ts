import { NextRequest, NextResponse } from "next/server";
import {OpenAI} from "openai"

import { generateDebtPlanPrompt } from "@/utils/aiPrompt";
console.log("Initializing OpenAI client...");

const openai = new OpenAI({ apiKey: process.env.OPENAI_APIKEY });

export async function POST(req: Request) {
  try{
    console.log("Received request to generate debt plan");
    const { debts, userProfile } = await req.json();
    const prompt = generateDebtPlanPrompt(debts, userProfile);
  
    console.log("Generated prompt:", prompt);
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });
  
      console.log("OpenAI response:", response);
  
      const plan = response.choices[0].message.content;
  
      return NextResponse.json({ plan });
    } catch (error) {
      console.error("Error generating response:", error);
      return NextResponse.json("Error generating response", { status: 500 });
    }

  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
  }
}