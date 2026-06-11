import { useState, useRef, useEffect } from 'react';
import type { Persona, Recommendation, Message } from './types';
import { getRecommendation } from './api/claude';
import { RecommendationView } from './components/RecommendationView';
import './App.css';

const PERSONAS: { id: Persona; label: string; description: string }[] = [
  { id: 'product', label: 'Product', description: 'Requirements & capabilities' },
  { id: 'designer', label: 'Designer', description: 'Components & layout' },
  { id: 'developer', label: 'Developer', description: 'Props, variants & code' },
];

const EXAMPLE_SCENARIOS = [
  'A settings page where merchants manage email notification preferences',
  'A product list page with bulk editing, filtering by status, and a search bar',
  'A checkout customization screen where users can toggle features on/off',
  'An order detail page showing line items, shipping info, and timeline',
];

function generateBrief(scenario: string, persona: Persona | null, rec: Recommendation): string {
  const lines: string[] = [];
  lines.push(`# Polaris Scenario Brief`);
  lines.push(`**Scenario:** ${scenario}`);
  if (persona) lines.push(`**Audience:** ${persona}`);
  lines.push('');
  lines.push(`## Summary`);
  lines.push(rec.summary);
  lines.push('');
  lines.push(`## Recommended Components`);
  rec.components.forEach(c => {
    lines.push(`- **${c.name}** — ${c.rationale} ([docs](${c.docUrl}))`);
  });
  lines.push('');
  lines.push(`## Suggested Layout`);
  lines.push(rec.layout.description);
  if (rec.guidance.length > 0) {
    lines.push('');
    lines.push(`## Usage Guidance`);
    rec.guidance.forEach(g => {
      lines.push(`**${g.component}**`);
      lines.push(`  ✓ ${g.do}`);
      if (g.avoid) lines.push(`  ✗ ${g.avoid}`);
    });
  }
  if (rec.warnings.length > 0) {
    lines.push('');
    lines.push(`## Watch Out For`);
    rec.warnings.forEach(w => {
      lines.push(`- **${w.trigger}:** ${w.warning} → ${w.suggestion}`);
    });
  }
  return lines.join('\n');
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => sessionStorage.getItem('polaris-advisor-key') ?? '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keyError, setKeyError] = useState('');

  const [persona, setPersona] = useState<Persona | null>(null);
  const [scenario, setScenario] = useState('');
  const [refineInput, setRefineInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [currentScenario, setCurrentScenario] = useState('');
  const [briefCopied, setBriefCopied] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recommendation && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [recommendation]);

  function saveKey() {
    const key = apiKeyInput.trim();
    if (!key.startsWith('sk-ant-')) {
      setKeyError('API key should start with sk-ant-');
      return;
    }
    sessionStorage.setItem('polaris-advisor-key', key);
    setApiKey(key);
    setKeyError('');
  }

  async function submit(scenarioText: string, isRefinement = false) {
    if (!scenarioText.trim()) return;
    setLoading(true);
    setError('');

    const newMessage: Message = { role: 'user', content: scenarioText };
    const updatedHistory = isRefinement ? [...history, newMessage] : [];

    try {
      const rec = await getRecommendation(apiKey, scenarioText, persona, updatedHistory);
      const assistantMessage: Message = {
        role: 'assistant',
        content: JSON.stringify(rec),
      };
      setHistory(isRefinement
        ? [...updatedHistory, assistantMessage]
        : [newMessage, assistantMessage]
      );
      setRecommendation(rec);
      if (!isRefinement) setCurrentScenario(scenarioText);
      setRefineInput('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleCopyBrief() {
    if (!recommendation) return;
    const brief = generateBrief(currentScenario, persona, recommendation);
    navigator.clipboard.writeText(brief).then(() => {
      setBriefCopied(true);
      setTimeout(() => setBriefCopied(false), 2000);
    });
  }

  if (!apiKey) {
    return (
      <div className="key-gate">
        <div className="key-gate-card">
          <div className="logo">◈</div>
          <h1>Polaris Scenario Advisor</h1>
          <p>Describe what you're building. Get the right Polaris components, layout, and guidance — framed for your role.</p>
          <div className="key-form">
            <label htmlFor="apikey">Anthropic API Key</label>
            <input
              id="apikey"
              type="password"
              placeholder="sk-ant-..."
              value={apiKeyInput}
              onChange={e => { setApiKeyInput(e.target.value); setKeyError(''); }}
              onKeyDown={e => e.key === 'Enter' && saveKey()}
            />
            {keyError && <div className="key-error">{keyError}</div>}
            <button className="btn-primary" onClick={saveKey} disabled={!apiKeyInput.trim()}>
              Continue
            </button>
            <p className="key-note">Your key is stored in sessionStorage only and never sent anywhere except directly to Anthropic.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <span className="logo-mark">◈</span>
            <div>
              <h1>Polaris Scenario Advisor</h1>
              <p>Describe what you're building → get the right components</p>
            </div>
          </div>
          <button
            className="change-key"
            onClick={() => { sessionStorage.removeItem('polaris-advisor-key'); setApiKey(''); setApiKeyInput(''); }}
          >
            Change key
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="input-panel">
          <section className="persona-section">
            <h2>Who are you?</h2>
            <div className="persona-grid">
              {PERSONAS.map(p => (
                <button
                  key={p.id}
                  className={`persona-btn ${persona === p.id ? 'active' : ''}`}
                  onClick={() => setPersona(prev => prev === p.id ? null : p.id)}
                >
                  <span className="persona-label">{p.label}</span>
                  <span className="persona-desc">{p.description}</span>
                </button>
              ))}
            </div>
            {persona && (
              <p className="persona-note">Output will be framed for a {persona} person.</p>
            )}
          </section>

          <section className="scenario-section">
            <h2>What are you building?</h2>
            <textarea
              className="scenario-input"
              placeholder="Describe your scenario in plain language…&#10;&#10;e.g. A settings page where merchants manage notification preferences for order updates, promotions, and shipping alerts."
              value={scenario}
              onChange={e => setScenario(e.target.value)}
              rows={5}
              disabled={loading}
            />
            <div className="examples">
              <span className="examples-label">Try:</span>
              {EXAMPLE_SCENARIOS.map((ex, i) => (
                <button key={i} className="example-chip" onClick={() => setScenario(ex)}>
                  {ex}
                </button>
              ))}
            </div>
            <button
              className="btn-primary submit-btn"
              onClick={() => submit(scenario)}
              disabled={loading || !scenario.trim()}
            >
              {loading && !recommendation ? (
                <><span className="spinner" /> Analyzing…</>
              ) : (
                'Get recommendations →'
              )}
            </button>
          </section>
        </div>

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        {recommendation && (
          <div className="results-panel" ref={resultsRef}>
            <RecommendationView
              recommendation={recommendation}
              persona={persona}
              onCopyBrief={handleCopyBrief}
              briefCopied={briefCopied}
            />

            <section className="refine-section">
              <h3>Refine this recommendation</h3>
              <div className="refine-row">
                <input
                  type="text"
                  className="refine-input"
                  placeholder='e.g. "What if it also needs bulk actions?" or "Add a sidebar for help text"'
                  value={refineInput}
                  onChange={e => setRefineInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submit(refineInput, true)}
                  disabled={loading}
                />
                <button
                  className="btn-primary"
                  onClick={() => submit(refineInput, true)}
                  disabled={loading || !refineInput.trim()}
                >
                  {loading ? <span className="spinner" /> : 'Refine →'}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
