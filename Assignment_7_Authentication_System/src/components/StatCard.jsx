import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, color, percentage }) => {
  return (
    <div className="stat-card" style={{ '--accent-gradient': color }}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div 
          className="stat-icon-box" 
          style={{ background: `rgba(${color}, 0.15)`, color: `rgb(${color})` }}
        >
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="stat-value">{value}</div>

      {percentage !== undefined && (
        <div style={{ width: '100%', background: 'rgba(255, 255, 255, 0.08)', height: '4px', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${Math.min(100, Math.max(0, percentage))}%`, 
              height: '100%', 
              background: `rgb(${color})`,
              transition: 'width 0.4s ease'
            }} 
          />
        </div>
      )}

      <div className="stat-subtext">{subtext}</div>
    </div>
  );
};
