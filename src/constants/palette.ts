// Legacy names kept so older screens keep working. They now point at the
// design system in theme.ts, so every screen shares one look.
import { colors } from '@/constants/theme';

export const palette = {
  primary: colors.canopy,
  primaryLight: colors.leaf,
  background: colors.mist,
  card: colors.card,
  border: colors.line,
  text: colors.ink,
  muted: colors.muted,
  highly: colors.danger,
  highlyBg: colors.dangerBg,
  mildly: colors.caution,
  mildlyBg: colors.cautionBg,
  non: colors.safe,
  nonBg: colors.safeBg,
  highlight: colors.turmericBg,
  white: colors.white,
} as const;
