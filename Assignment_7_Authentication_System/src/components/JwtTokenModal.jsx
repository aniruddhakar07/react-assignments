import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Clock, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { decodeJwt, getTokenRemainingSeconds } from '../utils/jwt';

export const JwtTokenModal = ({ isOpen, onClose }) => {
  const { token, rememberMe } = useAuth();
  const [copied, setCopied] = useState(false);
  const [remainingSec, setRemainingSec] = useState(0);

  const decoded = decodeJwt(token);

  useEffect(() => {
    if (!token) return;
    setRemainingSec(getTokenRemainingSeconds(token));

    const interval = setInterval(() => {
      setRemainingSec(getTokenRemainingSeconds(token));
    }, 1000);

    return () => clearInterval(interval);
  }, [token, isOpen]);

  if (!isOpen || !decoded) return null;

  const parts = token.split('.');
  const headerPart = parts[0];
  const payloadPart = parts[1];
  const signaturePart = parts[2];

  const formatRemaining = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Key size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0 }}>Simulated JWT Token Inspector</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                RFC 7519 Compliant JSON Web Token Architecture
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Expiry & Storage Info Bar */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0.75rem 1rem', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.825rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#34d399' }}>
            <Clock size={15} />
            <span>Expires in: <strong>{formatRemaining(remainingSec)}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a5b4fc' }}>
            <ShieldCheck size={15} />
            <span>Persisted in: <strong>{rememberMe ? 'localStorage' : 'sessionStorage'}</strong></span>
          </div>
        </div>

        {/* 3-Segment Raw Token Display */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
              Encoded Token (Header . Payload . Signature)
            </span>
            <button 
              onClick={handleCopy} 
              style={{ background: 'transparent', border: 'none', color: copied ? '#34d399' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy Token'}</span>
            </button>
          </div>

          <div className="jwt-inspect-box" style={{ wordBreak: 'break-all', lineHeight: 1.6 }}>
            <span style={{ color: '#fb7185' }}>{headerPart}</span>
            <span style={{ color: '#ffffff' }}>.</span>
            <span style={{ color: '#c084fc' }}>{payloadPart}</span>
            <span style={{ color: '#ffffff' }}>.</span>
            <span style={{ color: '#38bdf8' }}>{signaturePart}</span>
          </div>
        </div>

        {/* Decoded Header and Payload */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Header */}
          <div>
            <span className="jwt-segment-tag" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fda4af' }}>
              Decoded Header (Algorithm & Token Type)
            </span>
            <pre className="jwt-inspect-box" style={{ margin: 0, height: '140px' }}>
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div>
            <span className="jwt-segment-tag" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#d8b4fe' }}>
              Decoded Payload (User Claims & Exp)
            </span>
            <pre className="jwt-inspect-box" style={{ margin: 0, height: '140px' }}>
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Close button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
