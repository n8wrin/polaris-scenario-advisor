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

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer = '';  // persists across chunks so split lines are reassembled

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';  // last element may be incomplete — keep for next chunk

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') continue;

      const parsed = JSON.parse(payload) as { text?: string; error?: string };
      if (parsed.error) throw new Error(parsed.error);
      if (parsed.text) accumulated += parsed.text;
    }
  }

  // flush any remaining buffer content
  if (buffer.startsWith('data: ')) {
    const payload = buffer.slice(6).trim();
    if (payload && payload !== '[DONE]') {
      try {
        const parsed = JSON.parse(payload) as { text?: string };
        if (parsed.text) accumulated += parsed.text;
      } catch { /* ignore malformed trailing line */ }
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
