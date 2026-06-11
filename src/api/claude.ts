import Anthropic from '@anthropic-ai/sdk';
import { POLARIS_COMPONENTS } from '../data/polarisComponents';
import type { Message, Persona, Recommendation } from '../types';

const PERSONA_CONTEXT: Record<Persona, string> = {
  product: `The user is a PRODUCT PERSON. They write requirements and need to know what the system can do.
Emphasize: What components exist and what they're capable of. Plain-language capability summary. Constraints they need to put in requirements. Component names they can reference in specs.
De-emphasize: Props, code, visual anatomy details.`,

  designer: `The user is a DESIGNER. They select and compose components to meet requirements.
Emphasize: Component recommendations with rationale. When-to-use vs. alternatives. Layout suggestion with visual context. Anatomy notes. Which variants fit this scenario.
De-emphasize: Code snippets, prop types.`,

  developer: `The user is a DEVELOPER. They implement the design using Polaris components.
Emphasize: Exact component names, relevant props and variants for this scenario, short code patterns, API doc links. Practical implementation notes.
De-emphasize: High-level rationale they already understand.`,
};

const SYSTEM_PROMPT = `You are the Polaris Scenario Advisor — an expert on Shopify's Polaris design system.

Your knowledge base of Polaris components:

${POLARIS_COMPONENTS}

When given a scenario (and optional persona), analyze what the user is building and return a structured JSON recommendation.

IMPORTANT: Return ONLY valid JSON. No markdown fences, no extra text, no explanations outside the JSON.

JSON schema:
{
  "summary": "string — persona-appropriate 2-3 sentence overview of the recommendation",
  "components": [
    {
      "name": "string — exact Polaris component name",
      "rationale": "string — why this component fits THIS scenario specifically",
      "relevantVariants": ["string"] or omit if not needed,
      "docUrl": "string — the doc URL for this component"
    }
  ],
  "layout": {
    "description": "string — prose description of the suggested layout",
    "regions": {
      "label": "string — component or region name",
      "note": "string or omit — brief annotation",
      "direction": "row or column or omit (default column)",
      "children": [] or omit
    }
  },
  "guidance": [
    {
      "component": "string",
      "do": "string — what to do in this scenario",
      "avoid": "string or omit — what not to do"
    }
  ],
  "warnings": [
    {
      "trigger": "string — what in the scenario triggered this warning",
      "warning": "string — the anti-pattern or near-miss",
      "suggestion": "string — what to use instead"
    }
  ]
}

Rules:
- Only recommend components from your knowledge base
- Make rationale specific to the scenario — not generic docs language
- If the scenario implies custom UI that Polaris already solves, flag it as a rework warning
- Layout regions should be a nested tree representing the visual composition
- 3–7 components is typical; don't pad with components that aren't relevant
- warnings array can be empty [] if no anti-patterns are detected`;

export async function getRecommendation(
  apiKey: string,
  scenario: string,
  persona: Persona | null,
  conversationHistory: Message[]
): Promise<Recommendation> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const personaInstruction = persona
    ? `\n\nPersona context: ${PERSONA_CONTEXT[persona]}`
    : '';

  const messages: Anthropic.MessageParam[] = conversationHistory.map(m => ({
    role: m.role,
    content: m.content,
  }));

  messages.push({
    role: 'user',
    content: `Scenario: ${scenario}${personaInstruction}`,
  });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages,
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

  try {
    return JSON.parse(cleaned) as Recommendation;
  } catch {
    throw new Error(`Failed to parse model response as JSON.\n\nRaw response:\n${text}`);
  }
}
