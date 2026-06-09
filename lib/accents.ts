// ---------------------------------------------------------------------------
// Accent swatch palette for the Appearance settings.
// Picking a swatch overrides the accent for the *currently active* persona
// only; clearing it falls back to that ICP's default accent.
// ---------------------------------------------------------------------------

export interface AccentSwatch {
  key: string;
  label: string;
  hex: string;
}

export const ACCENTS: AccentSwatch[] = [
  { key: "teal", label: "Teal", hex: "#117863" },
  { key: "indigo", label: "Indigo", hex: "#4f5bd5" },
  { key: "violet", label: "Violet", hex: "#7a4fd6" },
  { key: "blue", label: "Blue", hex: "#0f6fb0" },
  { key: "green", label: "Green", hex: "#2f6d4f" },
  { key: "amber", label: "Amber", hex: "#b4631b" },
  { key: "rose", label: "Rose", hex: "#c2456b" },
  { key: "slate", label: "Slate", hex: "#475569" },
];

export const ACCENTS_KEY = "personaon:accents";
