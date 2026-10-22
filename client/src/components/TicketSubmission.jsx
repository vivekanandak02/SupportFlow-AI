import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Send, Bot, CheckCircle, AlertTriangle, ArrowRight, RefreshCw, Cpu, Layers } from 'lucide-react';

const SAMPLE_PRESETS = [
  {
    label: '🚨 Database 500 Outage',
    title: 'PostgreSQL RDS cluster failing with 500 connection timeout',
    desc: 'The production database is rejecting connections from the API gateway. Users are experiencing 500 error screens and latency spikes. Urgent fix needed.'
  },
  {
    label: '💳 Duplicate Billing Charge',
    title: 'Duplicate invoice charge on corporate MasterCard for March',
    desc: 'We received two charges of $299 for our monthly subscription renewal. Please refund the duplicate transaction and correct our billing ledger.'
  },
  {
    label: '🔑 MFA Locked Out',
    title: 'Lost phone and cannot complete 2FA login verification',
    desc: 'Switched to a new mobile phone and lost access to Microsoft Authenticator. Need an admin reset of 2FA tokens to sign in.'
  },
  {
    label: '💡 Dark Mode Request',
    title: 'Add support for system-preference dark mode theme',
    desc: 'Our team uses the portal in late-night shifts and a high-contrast dark theme would greatly improve ergonomics. Please consider this feature.'
  }
];

export default function TicketSubmission({ onTicketCreated, setActiveTab }) {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aiPreview, setAiPreview] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successTicket, setSuccessTicket] = useState(null);

  const debounceTimerRef = useRef(null);

  // Debounced live AI classification whenever title or description changes
  useEffect(() => {
    if (!title.trim() && !description.trim()) {
      setAiPreview(null);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsClassifying(true);
      try {
        const res = await fetch('/api/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description })
        });
        if (res.ok) {
          const data = await res.json();
          setAiPreview(data);
          if (!manualOverride) {
            setSelectedCategory(data.category);
            setSelectedPriority(data.priority);
          }
        }
      } catch (err) {
        console.warn('Live classification error:', err);
      } finally {
        setIsClassifying(false);
      }
    }, 450);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [title, description, manualOverride]);

  const applyPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.desc);
    setManualOverride(false);
    setSuccessTicket(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both title and description for your ticket.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category: manualOverride ? selectedCategory : (aiPreview?.category || 'General Inquiry'),
        priority: manualOverride ? selectedPriority : (aiPreview?.priority || 'Medium'),
        assignedTeam: aiPreview?.assignedTeam || 'Customer Support'
      };

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit ticket');
      }

      setSuccessTicket(data.ticket);
      setTitle('');
      setDescription('');
      setAiPreview(null);
      if (onTicketCreated) onTicketCreated(data.ticket);
    } catch (err) {
      setError(err.message || 'Could not submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            padding: '6px 12px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#a5b4fc',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} /> AI-Powered Ticket Ingestion
          </div>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Submit a Support Ticket</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px' }}>
          Describe your problem or request. Our built-in NLP engine will automatically classify, prioritize, and route it to the right team.
        </p>
      </div>

      {/* Preset Test Case Buttons */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Try Sample Scenarios (Click to auto-fill)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="btn-secondary"
              style={{ fontSize: '0.825rem', padding: '8px 14px', borderRadius: '20px' }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successTicket && (
        <div className="glass-panel animate-fade-in" style={{
          padding: '20px 24px',
          marginBottom: '24px',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          background: 'rgba(16, 185, 129, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <CheckCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                Ticket {successTicket.ticketNumber} Created & Routed Successfully!
              </div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '3px' }}>
                Assigned to <strong style={{ color: '#38bdf8' }}>{successTicket.assignedTeam}</strong> with{' '}
                <strong style={{ color: successTicket.priority === 'Urgent' ? '#fb7185' : '#fbbf24' }}>
                  {successTicket.priority} Priority
                </strong>.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              View in Dashboard <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setSuccessTicket(null)}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Form Left, Real-Time AI Inspector Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }}>
        {/* Form Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>
                Ticket Subject / Title <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cannot access dashboard after password reset"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                style={{ fontSize: '1rem', fontWeight: 500 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>
                Detailed Description <span style={{ color: '#f43f5e' }}>*</span>
              </label>
              <textarea
                required
                rows={6}
                placeholder="Explain what happened, any error messages, how many users are affected, and what you need assistance with..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                style={{ resize: 'vertical', lineHeight: '1.6' }}
              />
            </div>

            {/* Manual Override Accordion */}
            <div style={{
              padding: '14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Manual classification override (Optional)
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={manualOverride}
                    onChange={(e) => setManualOverride(e.target.checked)}
                    style={{ accentColor: '#6366f1' }}
                  />
                  <span>Override AI</span>
                </label>
              </div>

              {manualOverride && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      <option value="Technical">Technical</option>
                      <option value="Billing">Billing</option>
                      <option value="Account Access">Account Access</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                      Priority
                    </label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className="input-field"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ padding: '14px', fontSize: '1rem', marginTop: '8px' }}
            >
              {submitting ? (
                <>
                  <RefreshCw className="pulse-dot" size={18} /> Submitting & Routing...
                </>
              ) : (
                <>
                  <Send size={18} /> Submit Support Ticket
                </>
              )}
            </button>
          </form>
        </div>

        {/* Real-time AI Classification Preview Inspector */}
        <div className="ai-glow-box glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} color="#c084fc" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Live Classifier</h2>
            </div>
            {isClassifying ? (
              <span style={{ fontSize: '0.75rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot" style={{ background: '#c084fc' }}></span> Analyzing...
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Real-time NLP</span>
            )}
          </div>

          {aiPreview ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade-in">
              {/* Category & Confidence */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                  PREDICTED CATEGORY
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge badge-cat-${aiPreview.category.toLowerCase().replace(/\s+/g, '')}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    {aiPreview.category}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>
                      {Math.round(aiPreview.confidence * 100)}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Confidence</div>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  marginTop: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.round(aiPreview.confidence * 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
                    borderRadius: '3px',
                    transition: 'width 0.4s ease'
                  }}></div>
                </div>
              </div>

              {/* Priority & Urgency */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                  AUTOMATIC PRIORITY ASSIGNMENT
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge badge-priority-${aiPreview.priority.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    {aiPreview.priority === 'Urgent' && <span className="pulse-dot"></span>}
                    {aiPreview.priority}
                  </span>
                </div>
              </div>

              {/* Department Routing */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  DEPARTMENT ROUTING TARGET
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#818cf8" />
                  {aiPreview.assignedTeam}
                </div>
              </div>

              {/* Detected Trigger Keywords */}
              {aiPreview.matchedKeywords?.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
                    SIGNAL KEYWORDS DETECTED
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {aiPreview.matchedKeywords.map((kw, i) => (
                      <span key={i} style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#c7d2fe'
                      }}>
                        #{kw}
                      </span>
                    ))}
                    {aiPreview.matchedUrgencyWords?.map((uw, i) => (
                      <span key={'u_' + i} style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(244, 63, 94, 0.15)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        color: '#fecdd3'
                      }}>
                        ⚡{uw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning */}
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                background: 'rgba(0,0,0,0.2)',
                padding: '12px',
                borderRadius: '8px',
                borderLeft: '3px solid #818cf8'
              }}>
                <strong>AI Reasoning:</strong> {aiPreview.reasoning}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '48px 16px',
              color: 'var(--text-dim)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Cpu size={36} color="var(--text-dim)" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Awaiting Ticket Input
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '4px', maxWidth: '240px' }}>
                  Start typing ticket details or select a preset above to see the AI classification preview in real-time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
