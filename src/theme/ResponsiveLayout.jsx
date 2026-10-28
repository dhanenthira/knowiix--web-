import React from 'react';
import './theme.css';
import './responsive.css';

/**
 * Universal Responsive Page Container
 * Ensures all existing and newly added screens inherit identical responsiveness & theme styling
 * 
 * @param {'default'|'wide'|'narrow'|'auth'} variant - Container max-width variant
 * @param {string} className - Optional custom class name
 * @param {string} as - Tag element ('main', 'div', 'section', etc.)
 */
export function PageContainer({
  children,
  variant = 'default',
  className = '',
  as: Component = 'main',
  style = {},
  ...props
}) {
  const variantClass = variant !== 'default' ? `page-container ${variant}` : 'page-container';
  return (
    <Component
      className={`${variantClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Universal Responsive Grid
 * Adapts columns cleanly across Mobile, Tablet, Laptop, and Desktop
 * 
 * @param {1|2|3|4|'cards'|'compact'|'wide'} cols
 */
export function ResponsiveGrid({
  children,
  cols = 'cards',
  gap,
  className = '',
  style = {},
  ...props
}) {
  let gridClass = 'grid-responsive-cards';
  if (cols === 1) gridClass = 'grid-responsive-1col';
  else if (cols === 2) gridClass = 'grid-responsive-2col';
  else if (cols === 3) gridClass = 'grid-responsive-3col';
  else if (cols === 4) gridClass = 'grid-responsive-4col';
  else if (cols === 'compact') gridClass = 'grid-responsive-cards-compact';
  else if (cols === 'wide') gridClass = 'grid-responsive-cards-wide';

  const combinedStyle = gap ? { ...style, gap } : style;

  return (
    <div
      className={`${gridClass} ${className}`.trim()}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Global Responsive App Shell
 * Top-level shell ensuring that all screens automatically inherit:
 * - Fluid responsive gutters
 * - Proper theme background and text colors
 * - Zero horizontal page overflow
 */
export function ResponsiveAppShell({ children, className = '', style = {} }) {
  return (
    <div className={`app-responsive-shell ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

export default {
  PageContainer,
  ResponsiveGrid,
  ResponsiveAppShell
};

