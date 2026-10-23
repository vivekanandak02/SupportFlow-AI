import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Sparkles, ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function LoginPage({ onSuccess }) {
  const { login, register, loginAsDemo } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async (demoRole) => {
    setError('');
    setSubmitting(true);
    try {
      await loginAsDemo(demoRole);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '40px auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 24px rgba(99, 102, 241, 0.5)',
          marginBottom: '14px'
        }}>
          <Sparkles size={28} color="#fff" />
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          {isRegister ? 'Create an Account' : 'Welcome to SupportFlow AI'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
          {isRegister 
            ? 'Join our smart automated ticket management workspace'
            : 'Sign in to access your tickets, dashboard, and AI routing'}
        </p>
      </div>

      {/* One-Click Quick Demo Sign-in Banner */}
      <div className="glass-panel" style={{ padding: '16px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
          ⚡ Quick Demo Instant Access (No Password Needed)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button
            type="button"
            onClick={() => handleDemo('admin')}
            disabled={submitting}
            className="btn-secondary"
            style={{
              padding: '10px 12px',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              background: 'rgba(99, 102, 241, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#a5b4fc' }}>
              <ShieldCheck size={16} /> Admin View
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Full triage & analytics</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemo('employee')}
            disabled={submitting}
            className="btn-secondary"
            style={{
              padding: '10px 12px',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'rgba(16, 185, 129, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#6ee7b7' }}>
              <UserCheck size={16} /> Employee View
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Submit & track tickets</span>
          </button>
        </div>
      </div>

      {/* Main Auth Form Card */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '18px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
              >
                <option value="employee">Employee / User</option>
                <option value="admin">Support Administrator / Agent</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px' }}
          >
            {submitting ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
          {isRegister ? 'Already have an account? ' : "Don't have an account yet? "}
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#818cf8',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isRegister ? 'Sign In here' : 'Register now'}
          </button>
        </div>
      </div>
    </div>
  );
}
