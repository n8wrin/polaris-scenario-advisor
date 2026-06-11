import type { Recommendation, Persona } from '../types';
import { WireframeView } from './WireframeView';
import { ComponentPreview } from './ComponentPreview';

interface Props {
  recommendation: Recommendation;
  persona: Persona | null;
  onCopyBrief: () => void;
  briefCopied: boolean;
}

const PERSONA_LABELS: Record<string, string> = {
  product: 'Product',
  designer: 'Designer',
  developer: 'Developer',
};

export function RecommendationView({ recommendation, persona, onCopyBrief, briefCopied }: Props) {
  const { summary, components, layout, guidance, warnings } = recommendation;

  return (
    <div className="recommendation">
      <div className="rec-header">
        <div>
          {persona && (
            <span className="persona-tag">{PERSONA_LABELS[persona]} view</span>
          )}
          <p className="rec-summary">{summary}</p>
        </div>
        <button className="copy-btn" onClick={onCopyBrief}>
          {briefCopied ? '✓ Copied' : 'Copy as brief'}
        </button>
      </div>

      {warnings.length > 0 && (
        <div className="section warnings-section">
          <h3 className="section-title">
            <span className="section-icon">⚠</span> Consider these first
          </h3>
          <div className="warnings-list">
            {warnings.map((w, i) => (
              <div key={i} className="warning-item">
                <div className="warning-trigger">Scenario implies: {w.trigger}</div>
                <div className="warning-text">{w.warning}</div>
                <div className="warning-suggestion">→ {w.suggestion}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <h3 className="section-title">
          <span className="section-icon">◆</span> Recommended components
        </h3>
        <div className={`components-grid${components.some(c => c.codeSnippet) ? ' components-grid--snippets' : ''}`}>
          {components.map((c, i) => (
            <div key={i} className="component-card">
              {persona === 'designer' && <ComponentPreview name={c.name} />}
              <div className="component-header">
                <span className="component-name">{c.name}</span>
                <a
                  href={c.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-link"
                >
                  Docs ↗
                </a>
              </div>
              <p className="component-rationale">{c.rationale}</p>
              {c.relevantVariants && c.relevantVariants.length > 0 && (
                <div className="variants">
                  {c.relevantVariants.map((v, j) => (
                    <span key={j} className="variant-chip">{v}</span>
                  ))}
                </div>
              )}
              {c.codeSnippet && (
                <pre className="component-snippet"><code>{c.codeSnippet}</code></pre>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">
          <span className="section-icon">□</span> Suggested layout
        </h3>
        <p className="layout-description">{layout.description}</p>
        <div className="wireframe-container">
          <WireframeView region={layout.regions} />
        </div>
      </div>

      {guidance.length > 0 && (
        <div className="section">
          <h3 className="section-title">
            <span className="section-icon">✓</span> Usage guidance for this scenario
          </h3>
          <div className="guidance-list">
            {guidance.map((g, i) => (
              <div key={i} className="guidance-item">
                <span className="guidance-component">{g.component}</span>
                <div className="guidance-do">✓ {g.do}</div>
                {g.avoid && (
                  <div className="guidance-avoid">✗ {g.avoid}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
