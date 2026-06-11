import type { Message, Persona, Recommendation } from '../types';

export async function getRecommendation(
  scenario: string,
  persona: Persona | null,
  conversationHistory: Message[]
): Promise<Recommendation> {
  const response = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario, persona, conversationHistory }),
  });

  if (!response.ok || !response.body) {
    const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(err.error || `Request failed: ${response.status}`);
  }

  // Read the SSE stream and accumulate the full JSON text
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') break;

      const parsed = JSON.parse(payload) as { text?: string; error?: string };
      if (parsed.error) throw new Error(parsed.error);
      if (parsed.text) accumulated += parsed.text;
    }
  }

  const cleaned = accumulated
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  try {
    return JSON.parse(cleaned) as Recommendation;
  } catch {
    throw new Error(`Failed to parse response as JSON.\n\nRaw: ${accumulated.slice(0, 200)}`);
  }
}
