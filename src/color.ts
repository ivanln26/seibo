export const twColors = [
  "primary",
  "secondary",
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "emerald",
  "cyan",
  "blue",
  "violet",
  "purple",
  "fuchsia",
  "pink",
] as const;

export type TwColor = typeof twColors[number];
