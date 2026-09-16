import React from 'react';
import { Check, X } from 'lucide-react';
import { evaluatePasswordStrength } from '../utils/passwordStrength';

export const PasswordStrengthBar = ({ password }) => {
  if (!password) return null;

  const { score, label, color, criteria } = evaluatePasswordStrength(password);

  return (
    <div className="strength-meter-container">
      {/* Header with Strength Label */}
      <div className="strength-header">
        <span style={{ color: 'var(--text-muted)' }}>Password Strength:</span>
        <span className="strength-label" style={{ color }}>
          {label} ({score}/4)
        </span>
      </div>

      {/* 4 Segmented Progress Bars */}
      <div className="strength-bars">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="strength-bar-segment"
            style={{
              background: index <= score ? color : 'rgba(255, 255, 255, 0.1)'
            }}
          />
        ))}
      </div>

      {/* Checklist Grid */}
      <div className="strength-criteria-grid">
        {criteria.map((item, idx) => (
          <div key={idx} className={`criteria-item ${item.met ? 'met' : ''}`}>
            {item.met ? <Check size={12} color="#34d399" /> : <X size={12} color="#64748b" />}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
