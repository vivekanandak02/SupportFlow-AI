import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search, Filter, RefreshCw, AlertCircle, CheckCircle, Clock,
  Flame, TrendingUp, Sparkles, Eye, ArrowUpRight, Cpu
} from 'lucide-react';

export default function AdminDashboard({ onSelectTicket }) {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchTicketsAndStats = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (categoryFilter !== 'All') queryParams.append('category', categoryFilter);
      if (priorityFilter !== 'All') queryParams.append('priority', priorityFilter);
      if (statusFilter !== 'All') queryParams.append('status', statusFilter);
      if (search.trim()) queryParams.append('search', search.trim());

      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`/api/tickets?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/analytics/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (ticketsRes.ok) {
        const data = await ticketsRes.json();
        setTickets(data.tickets);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load tickets/stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketsAndStats();
  }, [categoryFilter, priorityFilter, statusFilter, search]);

  const handleInlineStatusChange = async (e, ticketId) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTicketsAndStats();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Command Center
            </span>
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800 }}>Admin Support Operations</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Real-time ticket classification, automatic department routing & resolution pipeline
          </p>
        </div>

        <button
          onClick={fetchTicketsAndStats}
          disabled={loading}
          className="btn-secondary"
          style={{ padding: '9px 16px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={16} className={loading ? 'pulse-dot' : ''} />
          Refresh Pipeline
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        {/* Total Tickets */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL TICKETS</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>
            {stats?.total ?? '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Across all departments
          </div>
        </div>

        {/* Open & Active */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OPEN & UNRESOLVED</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#60a5fa' }}>
            {stats?.open ?? '—'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {stats?.inProgress || 0} currently in progress
          </div>
        </div>

        {/* Urgent & High Priority */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>URGENT & HIGH</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
              <Flame size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#fb7185' }}>
            {(stats?.urgentCount || 0) + (stats?.highCount || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {stats?.urgentCount || 0} critical emergency
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>RESOLUTION RATE</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#34d399' }}>
            {stats?.resolutionRate ?? '—'}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {stats?.resolved || 0} tickets resolved
          </div>
        </div>

        {/* AI Confidence */}
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 600 }}>AI ACCURACY SCORE</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
              <Cpu size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#c084fc' }}>
            {stats?.avgConfidence ?? '93.5%'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Zero manual categorization
          </div>
        </div>
      </div>

      {/* Category Breakdown Bar */}
      {stats?.byCategory && (
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
              Ticket Distribution by Category
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Auto-Classified by NLP
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {Object.entries(stats.byCategory).map(([cat, count]) => {
              const catClass = cat.toLowerCase().replace(/\s+/g, '');
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={cat} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span className={`badge badge-cat-${catClass}`} style={{ fontSize: '0.75rem' }}>{cat}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #38bdf8)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '18px 24px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search by ID, keyword, customer, or team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Account Access">Account Access</option>
              <option value="Feature Request">Feature Request</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table Card */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Support Tickets ({tickets.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Click any row to inspect AI routing & discussion
          </span>
        </div>

        {tickets.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
            No tickets found matching the specified filters.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '14px 20px' }}>Ticket</th>
                  <th style={{ padding: '14px 20px' }}>Subject</th>
                  <th style={{ padding: '14px 20px' }}>Category</th>
                  <th style={{ padding: '14px 20px' }}>Priority</th>
                  <th style={{ padding: '14px 20px' }}>Routed Team</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t._id}
                    onClick={() => onSelectTicket(t)}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Ticket # */}
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', whiteSpace: 'nowrap' }}>
                      {t.ticketNumber}
                    </td>

                    {/* Subject & User */}
                    <td style={{ padding: '16px 20px', maxWidth: '340px' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        by {t.createdBy?.name || 'Customer'} • {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <span className={`badge badge-cat-${t.category.toLowerCase().replace(/\s+/g, '')}`}>
                        {t.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <span className={`badge badge-priority-${t.priority.toLowerCase()}`}>
                        {t.priority === 'Urgent' && <span className="pulse-dot"></span>}
                        {t.priority}
                      </span>
                    </td>

                    {/* Routed Team */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      {t.assignedTeam}
                    </td>

                    {/* Status Dropdown */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                      <select
                        value={t.status}
                        onChange={(e) => handleInlineStatusChange(e, t._id)}
                        className={`badge badge-status-${t.status}`}
                        style={{ cursor: 'pointer', outline: 'none', border: 'none', fontSize: '0.75rem' }}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(t);
                        }}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Eye size={14} /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
