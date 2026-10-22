import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, CheckCircle2, Clock, MessageSquare, Send, User, Shield, AlertOctagon, Trash2 } from 'lucide-react';

export default function TicketDetailsModal({ ticket, onClose, onUpdateTicket, onDeleteTicket }) {
  const { user, token } = useAuth();
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!currentTicket) return null;

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/tickets/${currentTicket._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentTicket(data.ticket);
        if (onUpdateTicket) onUpdateTicket(data.ticket);
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const res = await fetch(`/api/tickets/${currentTicket._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ priority: newPriority })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentTicket(data.ticket);
        if (onUpdateTicket) onUpdateTicket(data.ticket);
      }
    } catch (err) {
      console.error('Update priority error:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/tickets/${currentTicket._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentTicket(data.ticket);
        setCommentText('');
        if (onUpdateTicket) onUpdateTicket(data.ticket);
      }
    } catch (err) {
      console.error('Post comment error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ticket ${currentTicket.ticketNumber}?`)) return;
    try {
      const res = await fetch(`/api/tickets/${currentTicket._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        if (onDeleteTicket) onDeleteTicket(currentTicket._id);
        onClose();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }} onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', fontFamily: 'monospace' }}>
                {currentTicket.ticketNumber}
              </span>
              <span className={`badge badge-cat-${currentTicket.category.toLowerCase().replace(/\s+/g, '')}`}>
                {currentTicket.category}
              </span>
              <span className={`badge badge-priority-${currentTicket.priority.toLowerCase()}`}>
                {currentTicket.priority === 'Urgent' && <span className="pulse-dot"></span>}
                {currentTicket.priority} Priority
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
              {currentTicket.title}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Submitted by <strong style={{ color: '#e2e8f0' }}>{currentTicket.createdBy?.name || 'Customer'}</strong> ({currentTicket.createdBy?.email}) • {new Date(currentTicket.createdAt).toLocaleString()}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAdmin && (
              <button
                onClick={handleDelete}
                title="Delete Ticket"
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fb7185',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem'
                }}
              >
                <Trash2 size={15} />
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: 'var(--text-muted)',
                padding: '6px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Status & Quick Action Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Current Status:
              </span>
              <select
                value={currentTicket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="input-field"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {isAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Priority:
                </span>
                <select
                  value={currentTicket.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="input-field"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            )}

            {currentTicket.status !== 'resolved' ? (
              <button
                onClick={() => handleStatusChange('resolved')}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  padding: '7px 14px',
                  fontSize: '0.825rem'
                }}
              >
                <CheckCircle2 size={16} /> Mark as Resolved
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={18} /> Ticket Resolved
              </div>
            )}
          </div>

          {/* AI Routing Analysis Box */}
          <div className="ai-glow-box" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={18} color="#c084fc" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
                AI Classification & Routing Breakdown
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.75rem',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                {Math.round((currentTicket.aiAnalysis?.confidence || 0.9) * 100)}% Confidence
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>ROUTED DEPARTMENT</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginTop: '2px' }}>
                  {currentTicket.assignedTeam}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>ASSIGNED AGENT</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginTop: '2px' }}>
                  {currentTicket.assignedTo || 'Unassigned'}
                </div>
              </div>
            </div>

            {currentTicket.aiAnalysis?.matchedKeywords?.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '4px' }}>MATCHED KEYWORDS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {currentTicket.aiAnalysis.matchedKeywords.map((kw, i) => (
                    <span key={i} style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#c7d2fe'
                    }}>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '8px' }}>
              <strong>Reasoning:</strong> {currentTicket.aiAnalysis?.reasoning || 'Automatically classified by NLP engine based on inquiry semantics.'}
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
              Description
            </h4>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.925rem',
              color: '#cbd5e1',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6
            }}>
              {currentTicket.description}
            </div>
          </div>

          {/* Activity & Comments Thread */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MessageSquare size={18} color="var(--text-muted)" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0' }}>
                Activity & Discussion ({currentTicket.comments?.length || 0})
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {currentTicket.comments && currentTicket.comments.length > 0 ? (
                currentTicket.comments.map((c, idx) => (
                  <div key={idx} style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: c.isAi ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: c.isAi ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: c.isAi ? '#a5b4fc' : '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {c.isAi && <Sparkles size={13} />}
                        {c.author}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                      {c.text}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textAlign: 'center', padding: '12px' }}>
                  No comments yet. Add an update below.
                </div>
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Type a response or internal note..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="input-field"
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="btn-primary"
                style={{ padding: '10px 18px' }}
              >
                <Send size={16} /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
