import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import TicketSubmission from './components/TicketSubmission';
import AIPlayground from './components/AIPlayground';
import LoginPage from './components/LoginPage';
import TicketDetailsModal from './components/TicketDetailsModal';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="pulse-dot" style={{ width: '16px', height: '16px', margin: '0 auto 12px auto', background: '#6366f1' }}></div>
          <p style={{ fontSize: '0.9rem' }}>Initializing SupportFlow AI...</p>
        </div>
      </div>
    );
  }

  // If not logged in and not on submit/playground
  if (!user && activeTab !== 'ai-lab' && activeTab !== 'submit') {
    return (
      <div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <LoginPage onSuccess={() => setActiveTab('dashboard')} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {activeTab === 'dashboard' && (
          user?.role === 'admin' ? (
            <AdminDashboard
              key={refreshKey}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            />
          ) : (
            <EmployeeDashboard
              key={refreshKey}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
              setActiveTab={setActiveTab}
            />
          )
        )}

        {activeTab === 'submit' && (
          <TicketSubmission
            setActiveTab={setActiveTab}
            onTicketCreated={() => {
              setRefreshKey((k) => k + 1);
            }}
          />
        )}

        {activeTab === 'ai-lab' && (
          <AIPlayground />
        )}

        {activeTab === 'login' && !user && (
          <LoginPage onSuccess={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Ticket Details Inspector Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdateTicket={(updated) => {
            setSelectedTicket(updated);
            setRefreshKey((k) => k + 1);
          }}
          onDeleteTicket={() => {
            setSelectedTicket(null);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-subtle)',
        padding: '20px 24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.8rem',
        background: 'rgba(10, 14, 23, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span><strong>SupportFlow AI</strong> — MERN Support System</span>
          <span>•</span>
          <span>Automatic NLP Classification & Priority Routing</span>
          <span>•</span>
          <span style={{ color: '#818cf8' }}>Node.js + Express + React + MongoDB Architecture</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
