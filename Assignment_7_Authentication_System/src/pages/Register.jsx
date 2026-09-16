import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PasswordStrengthBar } from '../components/PasswordStrengthBar';
import { evaluatePasswordStrength } from '../utils/passwordStrength';
import { 
  UserPlus, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, authError, clearAuthError, isAuthenticated } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const rawRedirect = queryParams.get('redirect');
  let redirectTarget = '/dashboard';
  if (rawRedirect) {
    try {
      const decoded = rawRedirect.startsWith('/') ? rawRedirect : decodeURIComponent(rawRedirect);
      // Avoid looping to login or register
      if (decoded && !decoded.includes('/login') && !decoded.includes('/register')) {
        redirectTarget = decoded;
      }
    } catch {
      redirectTarget = '/dashboard';
    }
  }

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  // Clear previous errors when mounting registration page
  useEffect(() => {
    clearAuthError();
  }, []);

  const validate = () => {
    const errs = {};
    if (!username.trim()) {
      errs.username = 'Username is required.';
    } else if (username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters.';
    }

    if (!password.trim()) {
      errs.password = 'Password is required.';
    } else {
      const strength = evaluatePasswordStrength(password);
      if (strength.score < 2) {
        errs.password = 'Password is too weak. Meet at least 2 criteria.';
      }
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await register({
        username: username.trim(),
        displayName: displayName.trim() || username.trim(),
        password,
        remember: rememberMe
      });

      if (res.success) {
        navigate(redirectTarget, { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <UserPlus size={26} strokeWidth={2.2} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Register to generate your credentials and simulated JWT token
          </p>
        </div>

        {authError && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              background: 'rgba(244, 63, 94, 0.15)', 
              border: '1px solid rgba(244, 63, 94, 0.35)', 
              borderRadius: 'var(--radius-md)', 
              padding: '0.75rem 1rem', 
              color: '#fda4af', 
              fontSize: '0.85rem', 
              marginBottom: '1.25rem' 
            }}
          >
            <AlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="reg-username">
              Username <span style={{ color: '#fb7185' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-username"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Choose a username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
              />
              <User 
                size={16} 
                color="var(--text-muted)" 
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} 
              />
            </div>
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="reg-name">
              Full Display Name
            </label>
            <input
              id="reg-name"
              type="text"
              className="form-control"
              placeholder="e.g., Alex Johnson"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" htmlFor="reg-password">
              Password <span style={{ color: '#fb7185' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
              />
              <KeyRound 
                size={16} 
                color="var(--text-muted)" 
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}

            {/* Password Strength Indicator */}
            <PasswordStrengthBar password={password} />
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: '1rem', marginTop: '0.75rem' }}>
            <label className="form-label" htmlFor="reg-confirm-password">
              Confirm Password <span style={{ color: '#fb7185' }}>*</span>
            </label>
            <input
              id="reg-confirm-password"
              type="password"
              className="form-control"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
            />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          {/* Remember User */}
          <div className="remember-row">
            <label className="custom-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember User (Store in localStorage)</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem 1rem', fontSize: '0.95rem' }}
          >
            <UserPlus size={17} />
            <span>{isSubmitting ? 'Registering...' : 'Register & Auto-Login'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to={`/login${location.search}`} style={{ color: '#a5b4fc', fontWeight: 600, textDecoration: 'underline' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
