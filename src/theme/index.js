/**
 * Official Design System Theme Configuration
 * Exported JS Theme Tokens & CSS imports
 */
import './theme.css';

export const THEME_COLORS = {
  primary: '#000000',        // Primary Colour: Black
  secondary: '#FFFFFF',      // Secondary Colour: White
  background: '#F8F9FA',     // Background Colour: Light Grey
  text: '#202124',           // Text Colour: Dark Grey
  mutedText: '#5F6368',      // Muted Text Colour: Grey
  border: '#DADCE0',         // Border Colour: Light Grey
  accent: '#4285F4',         // Accent Colour: Blue
  hover: '#303134'           // Hover Colour: Dark Grey
};

export const THEME_TYPOGRAPHY = {
  primaryFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  navigationFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  baseSize: '16px',
  bodyWeight: 400,           // Regular
  headingWeight: 500         // Medium
};

/**
 * Applies the design system theme CSS custom properties to document.documentElement
 * Ensuring all components throughout the entire website inherit these tokens uniformly.
 */
export function applyGlobalTheme(customColors = {}, customTypography = {}) {
  if (typeof document === 'undefined') return;

  const colors = { ...THEME_COLORS, ...customColors };
  const typography = { ...THEME_TYPOGRAPHY, ...customTypography };
  const root = document.documentElement;

  // Primary Colors
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-bg', colors.background);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-muted-text', colors.mutedText);
  root.style.setProperty('--color-border', colors.border);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-hover', colors.hover);

  // Mapped System Tokens
  root.style.setProperty('--bg-color', colors.background);
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--surface', colors.secondary);
  root.style.setProperty('--surface-card', colors.secondary);
  root.style.setProperty('--surface-elevated', colors.secondary);
  root.style.setProperty('--text-primary', colors.text);
  root.style.setProperty('--text-secondary', colors.mutedText);
  root.style.setProperty('--text-muted', colors.mutedText);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--border-card', colors.border);
  root.style.setProperty('--divider', colors.border);
  root.style.setProperty('--primary', colors.accent);
  root.style.setProperty('--accent', colors.accent);

  // Typography
  root.style.setProperty('--font-primary', typography.primaryFont);
  root.style.setProperty('--font-nav', typography.navigationFont);
  root.style.setProperty('--font-size-base', typography.baseSize);
  root.style.setProperty('--font-weight-body', String(typography.bodyWeight));
  root.style.setProperty('--font-weight-heading', String(typography.headingWeight));
}

// Automatically apply theme on load in browser environments
if (typeof document !== 'undefined') {
  applyGlobalTheme();
}

export const theme = {
  colors: THEME_COLORS,
  typography: THEME_TYPOGRAPHY,
  apply: applyGlobalTheme
};

export default theme;
