/**
 * Nguvu-Teach Brand Theme Configuration
 * Centralized design tokens for consistent styling across the app.
 */

const theme = {
  colors: {
    primary: '#16a34a',       // Green — growth, education, hope
    primaryLight: '#4ade80',
    primaryDark: '#14532d',
    secondary: '#f59e0b',     // Amber — warmth, energy, community
    secondaryLight: '#fde68a',
    secondaryDark: '#92400e',
    accent: '#3b82f6',        // Blue — trust, knowledge
    neutral: {
      white: '#ffffff',
      light: '#f9fafb',
      medium: '#6b7280',
      dark: '#1f2937',
      black: '#111827',
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  navLinks: [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'What We Do', href: '#what-we-do' },
    { label: 'Courses', href: '#courses' },
    { label: 'Events', href: '#events' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Apply', href: '#apply' },
    { label: 'Contact', href: '#contact' },
  ],
};

export default theme;
