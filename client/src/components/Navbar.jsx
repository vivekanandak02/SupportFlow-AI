import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LayoutDashboard, PlusCircle, Bot, LogOut, ShieldCheck, UserCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, loginAsDemo } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
        }}>
          <Sparkles size={20} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', fontFamily: 'Outfit', letterSpacing: '-0.02em', color: '#fff' }}>
              SupportFlow <span style={{ color: '#818cf8' }}>AI</span>
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>MERN MVP</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '-2px' }}>
            Smart NLP Classification & Routing
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            background: activeTab === 'dashboard' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: activeTab === 'dashboard' ? '#818cf8' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('submit')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            background: activeTab === 'submit' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: activeTab === 'submit' ? '#818cf8' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          <PlusCircle size={18} />
          <span>Submit Ticket</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-lab')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            background: activeTab === 'ai-lab' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
            color: activeTab === 'ai-lab' ? '#c084fc' : 'var(--text-muted)',
            transition: 'all 0.2s'
          }}
        >
          <Bot size={18} />
          <span>AI Classifier Lab</span>
        </button>
      </nav>

      {/* User Section & Fast Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {user ? (
          <>
            {/* Quick Demo Switcher Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              padding: '3px 4px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem'
            }}>
              <button
                onClick={() => loginAsDemo('admin')}
                title="Switch to Admin view"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: 'none',
                  background: user.role === 'admin' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                  color: user.role === 'admin' ? '#fff' : 'var(--text-dim)',
                  cursor: 'pointer',
                  fontWeight: user.role === 'admin' ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                <ShieldCheck size={14} />
                Admin
              </button>
              <button
                onClick={() => loginAsDemo('employee')}
                title="Switch to Employee view"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  border: 'none',
                  background: user.role === 'employee' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                  color: user.role === 'employee' ? '#fff' : 'var(--text-dim)',
                  cursor: 'pointer',
                  fontWeight: user.role === 'employee' ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                <UserCheck size={14} />
                Employee
              </button>
            </div>

            {/* User profile capsule */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 12px 4px 6px',
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)'
            }}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>{user.name.split(' ')[0]}</div>
                <div style={{ fontSize: '0.7rem', color: user.role === 'admin' ? '#818cf8' : '#34d399', textTransform: 'capitalize' }}>
                  {user.role}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.color = '#f43f5e'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-dim)'}
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setActiveTab('login')}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
