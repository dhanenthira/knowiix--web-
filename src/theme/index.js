/**
 * Official Design System Theme Configuration
 * Exported JS Theme Tokens & CSS imports
 */
import './theme.css';
import './responsive.css';
export { PageContainer, ResponsiveGrid, ResponsiveAppShell } from './ResponsiveLayout';

export const LIGHT_THEME_COLORS = {
  primary: '#000000',        // Primary Colour: Black
  secondary: '#FFFFFF',      // Secondary Colour: White
  background: '#F8F9FA',     // Background Colour: Light Grey
  text: '#202124',           // Text Colour: Dark Grey
  mutedText: '#5F6368',      // Muted Text Colour: Grey
  border: '#DADCE0',         // Border Colour: Light Grey
  accent: '#4285F4',         // Accent Colour: Blue
  hover: '#303134',          // Hover Colour: Dark Grey
  surfaceElevated: '#FFFFFF',
  surfaceHover: '#F1F3F4'
};

export const DARK_THEME_COLORS = {
  primary: '#FFFFFF',        // Primary Colour: White
  secondary: '#131A2A',      // Secondary Surface: Dark Slate Navy
  background: '#0B0F19',     // Background: Deep Dark
  text: '#F1F5F9',           // Text: Off-white
  mutedText: '#94A3B8',      // Muted: Slate Grey
  border: '#1E293B',         // Border: Slate
  accent: '#3B82F6',         // Accent: Vibrant Blue
  hover: '#1E293B',          // Hover: Slate
  surfaceElevated: '#1A2234',
  surfaceHover: '#243048'
};

export const THEME_COLORS = LIGHT_THEME_COLORS;

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

  const currentTheme = typeof customColors === 'string'
    ? customColors
    : (document.documentElement.getAttribute('data-theme') || (typeof localStorage !== 'undefined' ? localStorage.getItem('knowiix_theme') : null) || 'dark');

  const baseColors = currentTheme === 'light' ? LIGHT_THEME_COLORS : DARK_THEME_COLORS;
  const colors = typeof customColors === 'object' ? { ...baseColors, ...customColors } : baseColors;
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
  root.style.setProperty('--foreground', colors.text);
  root.style.setProperty('--surface', colors.secondary);
  root.style.setProperty('--surface-card', colors.secondary);
  root.style.setProperty('--surface-elevated', colors.surfaceElevated || (currentTheme === 'light' ? colors.secondary : '#1A2234'));
  root.style.setProperty('--surface-hover', colors.surfaceHover || (currentTheme === 'light' ? '#F1F3F4' : '#243048'));
  root.style.setProperty('--text-primary', colors.text);
  root.style.setProperty('--text-secondary', colors.mutedText);
  root.style.setProperty('--text-muted', colors.mutedText);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--border-card', colors.border);
  root.style.setProperty('--divider', colors.border);
  root.style.setProperty('--card', colors.secondary);
  root.style.setProperty('--card-foreground', colors.text);
  root.style.setProperty('--popover', colors.secondary);
  root.style.setProperty('--popover-foreground', colors.text);
  root.style.setProperty('--primary', colors.accent);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--card-shadow', currentTheme === 'light'
    ? '0 1px 3px rgba(60, 64, 67, 0.08), 0 2px 8px rgba(60, 64, 67, 0.04)'
    : '0 4px 20px rgba(0, 0, 0, 0.45)');

  // Typography
  root.style.setProperty('--font-primary', typography.primaryFont);
  root.style.setProperty('--font-nav', typography.navigationFont);
  root.style.setProperty('--font-size-base', typography.baseSize);
  root.style.setProperty('--font-weight-body', String(typography.bodyWeight));
  root.style.setProperty('--font-weight-heading', String(typography.headingWeight));
}

// Automatically apply theme on load in browser environments
if (typeof document !== 'undefined') {
  const savedTheme = localStorage.getItem('knowiix_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  document.documentElement.classList.toggle('light', savedTheme === 'light');
  if (document.body) {
    document.body.setAttribute('data-theme', savedTheme);
    document.body.classList.toggle('dark', savedTheme === 'dark');
    document.body.classList.toggle('light', savedTheme === 'light');
  }
  applyGlobalTheme(savedTheme);
}

export const theme = {
  colors: THEME_COLORS,
  lightColors: LIGHT_THEME_COLORS,
  darkColors: DARK_THEME_COLORS,
  typography: THEME_TYPOGRAPHY,
  apply: applyGlobalTheme
};

export default theme;
