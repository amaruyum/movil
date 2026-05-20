/**
 * Colors.ts
 * Paleta de colores centralizada de CineList.
 * Toda la app importa los colores desde aquí para mantener consistencia visual.
 */

export const Colors = {
  // ── Fondos ───────────────────────────────
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceAlt: '#242424',

  // ── Acento ───────────────────────────────
  accent: '#E5383B',
  accentDark: '#B52427',
  accentMuted: '#E5383B33',

  // ── Texto ────────────────────────────────
  textPrimary: '#F5F5F5',
  textSecondary: '#A0A0A0',
  textMuted: '#555555',

  // ── Estados ──────────────────────────────
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#CF6679',

  // ── Bordes ───────────────────────────────
  border: '#2E2E2E',
  borderFocus: '#E5383B',

  // ── Estrellas ────────────────────────────
  star: '#FFD700',
  starEmpty: '#333333',

  // ── Tabs ─────────────────────────────────
  tabActive: '#E5383B',
  tabInactive: '#555555',
  tabBar: '#111111',
} as const;

/** Géneros disponibles para selección en formularios */
export const GENEROS = [
  'Acción',
  'Aventura',
  'Animación',
  'Ciencia Ficción',
  'Comedia',
  'Drama',
  'Fantasía',
  'Horror',
  'Musical',
  'Romance',
  'Suspenso',
  'Terror',
  'Thriller',
  'Western',
] as const;

export type Genero = (typeof GENEROS)[number];