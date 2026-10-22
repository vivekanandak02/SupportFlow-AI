import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Clock, CheckCircle2, AlertCircle, Eye, Sparkles, Inbox } from 'lucide-react';

export default function EmployeeDashboard({ onSelectTicket, setActiveTab }) {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error('Fetch employee tickets error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const total = tickets.length;
  const activeCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.05))',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Employee Portal
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>
            Hello, {user?.name || 'User'} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Track your ongoing requests or submit a new inquiry with automated AI routing.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('submit')}
          className="btn-primary"
          style={{ padding: '12px 22px', fontSize: '0.95rem' }}
        >
          <PlusCircle size={18} /> Submit New Ticket
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MY TOTAL REQUESTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
            {total}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING RESOLUTION</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#60a5fa' }}>
            {activeCount}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>RESOLVED TICKETS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#34d399' }}>
            {resolvedCount}
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            My Submitted Tickets ({total})
          </h3>
        </div>

        {tickets.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <Inbox size={42} color="var(--text-dim)" />
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                No tickets submitted yet
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                Need help with a technical error, billing question, or feature request?
              </p>
            </div>
            <button
              onClick={() => setActiveTab('submit')}
              className="btn-primary"
              style={{ marginTop: '8px', padding: '9px 18px', fontSize: '0.85rem' }}
            >
              <PlusCircle size={16} /> Create Your First Ticket
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tickets.map((t) => (
              <div
                key={t._id}
                onClick={() => onSelectTicket(t)}
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace', color: '#818cf8' }}>
                      {t.ticketNumber}
                    </span>
                    <span className={`badge badge-cat-${t.category.toLowerCase().replace(/\s+/g, '')}`}>
                      {t.category}
                    </span>
                    <span className={`badge badge-priority-${t.priority.toLowerCase()}`}>
                      {t.priority}
                    </span>
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
                    {t.title}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>Routed to: <strong style={{ color: '#cbd5e1' }}>{t.assignedTeam}</strong></span>
                    <span>•</span>
                    <span>Created: {new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span className={`badge badge-status-${t.status}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    <Eye size={14} /> View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
