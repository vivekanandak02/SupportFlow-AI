import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('supportflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('supportflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify stored session or set default demo user if empty
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Session invalid');
          return res.json();
        })
        .then(data => {
          setUser(data.user);
          localStorage.setItem('supportflow_user', JSON.stringify(data.user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      // Auto-login as default admin for instant MVP review if no session
      loginAsDemo('admin').finally(() => setLoading(false));
    }
  }, []);

  const login = async (email, password) => {
    let res;
    try {
      res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    } catch (networkErr) {
      throw new Error('Backend server is offline. Please start it on port 5000 using: node server/server.js');
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      throw new Error('Backend server is offline or unreachable on port 5000. Please start the backend server.');
    }

    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('supportflow_token', data.token);
    localStorage.setItem('supportflow_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, email, password, role = 'employee') => {
    let res;
    try {
      res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
    } catch (networkErr) {
      throw new Error('Backend server is offline. Please start it on port 5000 using: node server/server.js');
    }

    let data;
    try {
      data = await res.json();
    } catch (jsonErr) {
      throw new Error('Backend server is offline or unreachable on port 5000. Please start the backend server.');
    }

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('supportflow_token', data.token);
    localStorage.setItem('supportflow_user', JSON.stringify(data.user));
    return data.user;
  };

  const loginAsDemo = async (role = 'admin') => {
    const email = role === 'admin' ? 'admin@supportflow.ai' : 'user@supportflow.ai';
    const password = role === 'admin' ? 'admin123' : 'user123';
    return await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('supportflow_token');
    localStorage.removeItem('supportflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
