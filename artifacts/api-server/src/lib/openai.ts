// OpenAI client for AI-powered investment explanations
// Falls back gracefully if no API key is available

let openaiClient: any = null;

async function getClient(): Promise<any> {
  if (openaiClient) return openaiClient;
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  if (!apiKey) return null;

  try {
    // Dynamic import to avoid crashing if openai isn't installed
    const { OpenAI } = await import("openai");
    openaiClient = new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });
    return openaiClient;
  } catch {
    return null;
  }
}

export async function askAI(messages: Array<{ role: string; content: string }>): Promise<string | null> {
  const client = await getClient();
  if (!client) return null;
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 350,
    });
    return completion.choices[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}
