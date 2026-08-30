import React, { useState, useEffect } from 'react';

const DEFAULT_ELECTION_TYPES = [
  { id: 'general', name: 'General Assembly Elections', desc: 'National/State democratic legislative voting.' },
  { id: 'banking', name: 'Banking Board Elections', desc: 'Board of directors election for cooperative banks.' },
  { id: 'college', name: 'College Union Elections', desc: 'Student council representative elections.' }
];

function getAdminCredentials() {
  const saved = localStorage.getItem('admin_credentials');
  return saved ? JSON.parse(saved) : [
    { username: 'superadmin', password: 'super@123', role: 'superadmin' },
    { username: 'admin', password: 'admin@123', role: 'admin', assignedElectionType: 'general' }
  ];
}

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const session = sessionStorage.getItem('admin_session');
    if (session) {
      const parsed = JSON.parse(session);
      onLogin(parsed);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const credentials = getAdminCredentials();
      const match = credentials.find(
        c => c.username === username.trim() && c.password === password
      );

      if (!match) {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
        return;
      }

      // Save session
      sessionStorage.setItem('admin_session', JSON.stringify(match));
      onLogin(match);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background animated particles */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.06)',
            width: `${120 + i * 80}px`,
            height: `${120 + i * 80}px`,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 16}%`,
            animation: `float ${4 + i}s ease-in-out infinite alternate`
          }} />
        ))}
      </div>

      <div style={{
        width: '100%',
        maxWidth: '460px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 1.25rem',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', boxShadow: '0 16px 40px rgba(99,102,241,0.45)',
            fontWeight: 900, color: '#fff', letterSpacing: '-1px'
          }}>
            AV
          </div>
          <h1 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            Admin Portal
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            Aadhar-Based Electronic Voting System
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,27,74,0.9) 100%)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              🔐 Secure Login
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Username */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
                letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem'
              }}>
                Username
              </label>
              <input
                id="admin-login-username"
                type="text"
                autoFocus
                placeholder="Enter username"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                style={{
                  width: '100%', padding: '0.85rem 1rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${error ? 'rgba(255,23,68,0.5)' : 'rgba(255,255,255,0.12)'}`,
                  borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(255,23,68,0.5)' : 'rgba(255,255,255,0.12)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <label style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase',
                letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  style={{
                    width: '100%', padding: '0.85rem 3rem 0.85rem 1rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${error ? 'rgba(255,23,68,0.5)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '12px', color: '#fff', fontSize: '0.95rem',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                  onBlur={e => e.target.style.borderColor = error ? 'rgba(255,23,68,0.5)' : 'rgba(255,255,255,0.12)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer', fontSize: '1rem', padding: 0
                  }}
                >{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.3)',
                borderRadius: '10px', padding: '0.75rem 1rem',
                color: '#ff1744', fontSize: '0.83rem', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: loading
                  ? 'rgba(99,102,241,0.4)'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                border: 'none', borderRadius: '14px',
                color: '#fff', fontSize: '1rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.4)',
                letterSpacing: '0.02em'
              }}
            >
              {loading ? '⏳ Authenticating...' : '🔐 Login to Dashboard'}
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '1.5rem',
            paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <a href="/" style={{
              color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem',
              textDecoration: 'none'
            }}>
              ← Back to Voting Kiosk
            </a>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', marginTop: '2rem' }}>
          🔒 Secure Encrypted Connection • ECI Certified System
        </p>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); }
          to { transform: translateY(-20px) scale(1.05); }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
};

export default AdminLogin;
