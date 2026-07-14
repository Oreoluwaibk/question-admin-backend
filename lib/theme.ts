/** Matches question-app/constants/theme.ts palette */
export const Palette = {
  mint: "#48B89A",
  mintSoft: "rgba(72, 184, 154, 0.18)",
  mintGlow: "rgba(72, 184, 154, 0.28)",
  slate: "#6E8299",
  slateLight: "#94A3B8",
  ink: "#0E1422",
  inkSoft: "#151C2D",
  paper: "#F4F6F9",
  white: "#FFFFFF",
  borderLight: "#D8E0EA",
  borderDark: "#2A3548",
  cardLight: "#FFFFFF",
  cardDark: "#171F30",
  danger: "#E5484D",
};

export const Colors = {
  light: {
    text: "#0E1422",
    background: Palette.paper,
    tint: Palette.mint,
    card: Palette.cardLight,
    border: Palette.borderLight,
    muted: "#64748B",
    primaryText: "#FFFFFF",
  },
  dark: {
    text: "#D7DFED",
    background: Palette.ink,
    tint: Palette.mint,
    card: Palette.cardDark,
    border: Palette.borderDark,
    muted: "#94A3B8",
    primaryText: Palette.ink,
  },
};
