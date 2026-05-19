import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      const apiBase = process.env.REACT_APP_API_URL || '';
      const url = `${apiBase}/api/auth/verify`;
      console.log('[Auth] VERIFY request →', { url, tokenPreview: token?.slice(0, 10) + '…' });
      fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log('[Auth] VERIFY response ←', data);
        if (data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(() => {
        console.error('[Auth] VERIFY network error');
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const apiBase = process.env.REACT_APP_API_URL || '';
      const url = `${apiBase}/api/auth/login`;
      const body = { email, password };
      console.log('[Auth] LOGIN request →', { url, body });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('[Auth] LOGIN response ←', { status: response.status, data });
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('[Auth] LOGIN catch error ←', error);
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (email, password, name) => {
    try {
      const apiBase = process.env.REACT_APP_API_URL || '';
      const url = `${apiBase}/api/auth/register`;
      const body = { email, password, name };
      console.log('[Auth] REGISTER request →', { url, body });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('[Auth] REGISTER response ←', { status: response.status, data });
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('[Auth] REGISTER catch error ←', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
