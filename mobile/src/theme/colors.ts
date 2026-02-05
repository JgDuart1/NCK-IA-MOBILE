export const colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#0F172A',
  },

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const darkTheme = {
  background: colors.neutral[950],
  surface: colors.neutral[900],
  surfaceSecondary: colors.neutral[800],
  text: colors.neutral[50],
  textSecondary: colors.neutral[400],
  textMuted: colors.neutral[500],
  border: colors.neutral[700],
  borderLight: colors.neutral[800],
  primary: colors.primary[500],
  primaryHover: colors.primary[600],
} as const;

export type Theme = typeof darkTheme;
