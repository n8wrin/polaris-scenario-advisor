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

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(err.error || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<Recommendation>;
}
