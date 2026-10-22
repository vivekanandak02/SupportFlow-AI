import React, { useState } from 'react';
import { Bot, Sparkles, Send, Cpu, CheckCircle2, ArrowRight, Zap, RefreshCw, BarChart2 } from 'lucide-react';

const TEST_SCENARIOS = [
  {
    title: 'PostgreSQL RDS Cluster 500 Outage',
    desc: 'The database cluster is crashing intermittently under load. Internal server error 500 returned on all write transactions. Severe production degradation affecting all customers.',
    expectedCat: 'Technical',
    expectedPri: 'Urgent'
  },
  {
    title: 'Duplicate charge of $499 on corporate credit card',
    desc: 'Our latest billing invoice shows two identical charges of $499 for the yearly subscription. Please initiate a refund to the original payment method.',
    expectedCat: 'Billing',
    expectedPri: 'High'
  },
  {
    title: 'Lost phone and need 2FA authenticator reset',
    desc: 'I changed devices and can no longer generate MFA verification codes for login. Administrator authorization required to reset security settings.',
    expectedCat: 'Account Access',
    expectedPri: 'High'
  },
  {
    title: 'Add support for Slack notification webhooks',
    desc: 'It would be wonderful if our support team could receive real-time webhook alerts directly inside our company Slack channel whenever high priority tickets arrive.',
    expectedCat: 'Feature Request',
    expectedPri: 'Low'
  },
  {
    title: 'Where can I find the API rate limits documentation?',
    desc: 'Hi there, could you point me to the developer docs detailing how many requests per minute we are allowed on the v2 REST endpoints?',
    expectedCat: 'General Inquiry',
    expectedPri: 'Low'
  }
];

export default function AIPlayground() {
  const [inputTitle, setInputTitle] = useState(TEST_SCENARIOS[0].title);
  const [inputDesc, setInputDesc] = useState(TEST_SCENARIOS[0].desc);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClassify = async (t = inputTitle, d = inputDesc) => {
    setLoading(true);
    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t, description: d })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Classification test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectScenario = (sc) => {
    setInputTitle(sc.title);
    setInputDesc(sc.desc);
    handleClassify(sc.title, sc.desc);
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{
            padding: '4px 10px',
            borderRadius: '16px',
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Bot size={14} /> NLP Intelligence Lab
          </div>
        </div>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>AI Ticket Classifier & Routing Testbed</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Test the NLP classification algorithm on custom support prompts, inspect signal keyword extraction, confidence scoring, and automated team routing.
        </p>
      </div>

      {/* Quick Test Presets */}
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Load Ready-Made Benchmarks
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {TEST_SCENARIOS.map((sc, i) => (
            <button
              key={i}
              onClick={() => handleSelectScenario(sc)}
              className="btn-secondary"
              style={{
                textAlign: 'left',
                padding: '12px 14px',
                fontSize: '0.825rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                borderRadius: '10px'
              }}
            >
              <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{sc.title}</span>
              <span style={{ fontSize: '0.72rem', color: '#818cf8' }}>
                Expected: {sc.expectedCat} • {sc.expectedPri}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Playground Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Input Sandbox */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#eab308" />
            Input Prompt
          </h3>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Ticket Subject
            </label>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="input-field"
              placeholder="e.g. Broken API checkout endpoint"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Ticket Description & Details
            </label>
            <textarea
              rows={7}
              value={inputDesc}
              onChange={(e) => setInputDesc(e.target.value)}
              className="input-field"
              placeholder="Enter customer message..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <button
            onClick={() => handleClassify()}
            disabled={loading}
            className="btn-primary"
            style={{ padding: '12px', marginTop: '4px' }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="pulse-dot" /> Classifying...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Run NLP Classifier
              </>
            )}
          </button>
        </div>

        {/* AI Output Analysis Card */}
        <div className="ai-glow-box glass-panel" style={{ padding: '24px', minHeight: '380px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Cpu size={18} color="#c084fc" />
            Classification Breakdown & Diagnostics
          </h3>

          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade-in">
              {/* Category & Confidence */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '6px' }}>CLASSIFIED CATEGORY</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge badge-cat-${result.category.toLowerCase().replace(/\s+/g, '')}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                    {result.category}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>
                    {Math.round(result.confidence * 100)}% Match
                  </span>
                </div>
              </div>

              {/* Priority & Urgency */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '6px' }}>ASSIGNED PRIORITY</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge badge-priority-${result.priority.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                    {result.priority === 'Urgent' && <span className="pulse-dot"></span>}
                    {result.priority}
                  </span>
                </div>
              </div>

              {/* Routing Target */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>ROUTED DEPARTMENT</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                  🎯 {result.assignedTeam}
                </div>
              </div>

              {/* Matched Keywords */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  EXTRACTED SIGNAL TOKENS
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {result.matchedKeywords?.map((kw, i) => (
                    <span key={i} style={{
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: '#a5b4fc'
                    }}>
                      #{kw}
                    </span>
                  ))}
                  {result.matchedUrgencyWords?.map((uw, i) => (
                    <span key={'u_' + i} style={{
                      fontSize: '0.75rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(244, 63, 94, 0.15)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      color: '#fb7185'
                    }}>
                      ⚡{uw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                borderLeft: '3px solid #818cf8'
              }}>
                <strong>Explanation:</strong> {result.reasoning}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 16px',
              color: 'var(--text-dim)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Bot size={40} color="var(--text-dim)" />
              <div>Click &quot;Run NLP Classifier&quot; or choose a benchmark scenario above to execute the model.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
