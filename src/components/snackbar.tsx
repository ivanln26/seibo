"use client";

type Color = "primary" | "secondary" | "tertiary" | "error";

const colors: Record<Color, string> = {
  "primary":
    "bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100",
  "secondary":
    "bg-secondary-100 text-secondary-900 dark:bg-secondary-700 dark:text-secondary-100",
  "tertiary":
    "bg-tertiary-100 text-tertiary-900 dark:bg-tertiary-700 dark:text-tertiary-100",
  "error": "bg-error-100 text-error-900 dark:bg-error-700 dark:text-error-100",
};

export type SnackbarMessage = {
  message: string;
  color?: Color;
};

type Props = {
  list: SnackbarMessage[];
};

export default function Snackbar({ list }: Props) {
  return (
    <ul className="flex flex-col gap-y-2 absolute bottom-4 right-4">
      {list.map(({ message, color = "primary" }, i) => (
        <li className={`px-4 py-2 rounded ${colors[color]}`} key={i}>
          {message}
        </li>
      ))}
    </ul>
  );
}
