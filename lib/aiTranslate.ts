export async function aiTranslate(text: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return text;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `Translate the following text to natural spoken Kikuyu. Only return the Kikuyu translation, nothing else.\n\n${text}`,
        },
      ],
      temperature: 0.4,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "AI translation failed");
  return data.choices[0].message.content.trim();
}
