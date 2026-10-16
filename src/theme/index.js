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

export const theme = {
  colors: THEME_COLORS,
  typography: THEME_TYPOGRAPHY
};

export default theme;
