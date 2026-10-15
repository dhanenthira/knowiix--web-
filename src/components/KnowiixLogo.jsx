import React from 'react';
import logoImage from '../assets/knowiix-logo.jpg';

/**
 * Knowiix Official Logo Component
 * Renders the exact user-uploaded branding image from assets with responsive sizing
 */
export default function KnowiixLogo({
  size = 'md',
  showText = true,
  className = '',
  style = {},
  imageOnly = false,
  inverted = false
}) {
  const sizeMap = {
    xs: { height: 26, borderRadius: '6px', padding: '2px 6px' },
    sm: { height: 34, borderRadius: '8px', padding: '3px 8px' },
    md: { height: 42, borderRadius: '10px', padding: '4px 10px' },
    lg: { height: 56, borderRadius: '12px', padding: '6px 14px' },
    xl: { height: 74, borderRadius: '14px', padding: '8px 18px' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`knowiix-brand-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#FFFFFF',
        borderRadius: currentSize.borderRadius,
        padding: currentSize.padding,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        height: `${currentSize.height}px`,
        overflow: 'hidden',
        userSelect: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style
      }}
    >
      <img
        src={logoImage}
        alt="Knowiix Logo"
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
}
