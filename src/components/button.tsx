import type { ReactNode } from "react";

import Add from "@/components/add";

type Color = "primary" | "secondary" | "tertiary" | "error";

type Kind = "filled" | "tonal" | "outlined" | "text" | "elevated";

type Type = "button" | "submit" | "reset";

type Icon = "add";

type ButtonProps = {
  children: ReactNode;
  color?: Color;
  kind?: Kind;
  type?: Type;
  icon?: Icon;
};

const config: Record<Kind, Record<Color, string>> = {
  filled: {
    primary:
      "text-white fill-white bg-primary-600 dark:text-primary-800 dark:fill-primary-800 dark:bg-primary-200",
    secondary:
      "text-white fill-white bg-secondary-600 dark:text-secondary-800 dark:fill-secondary-800 dark:bg-secondary-200",
    tertiary:
      "text-white fill-white bg-tertiary-600 dark:text-tertiary-800 dark:fill-tertiary-800 dark:bg-tertiary-200",
    error:
      "text-white fill-white bg-error-600 dark:text-error-800 dark:fill-error-800 dark:bg-error-200",
  },
  tonal: {
    primary:
      "text-primary-900 fill-primary-900 bg-primary-100 dark:text-primary-100 dark:fill-primary-100 dark:bg-primary-700",
    secondary:
      "text-secondary-900 fill-secondary-900 bg-secondary-100 dark:text-secondary-100 dark:fill-secondary-100 dark:bg-secondary-700",
    tertiary:
      "text-tertiary-900 fill-tertiary-900 bg-tertiary-100 dark:text-tertiary-100 dark:fill-tertiary-100 dark:bg-tertiary-700",
    error:
      "text-error-900 fill-error-900 bg-error-100 dark:text-error-100 dark:fill-error-100 dark:bg-error-700",
  },
  outlined: {
    primary:
      "text-primary-600 fill-primary-600 outline outline-1 outline-outline dark:text-primary-200 dark:fill-primary-200",
    secondary:
      "text-secondary-600 fill-secondary-600 outline outline-1 outline-outline dark:text-secondary-200 dark:fill-secondary-200",
    tertiary:
      "text-tertiary-600 fill-tertiary-600 outline outline-1 outline-outline dark:text-tertiary-200 dark:fill-tertiary-200",
    error:
      "text-error-600 fill-error-600 outline outline-1 outline-outline dark:text-error-200 dark:fill-error-200",
  },
  text: {
    primary:
      "text-primary-600 fill-primary-600 dark:text-primary-200 dark:fill-primary-200",
    secondary:
      "text-secondary-600 fill-secondary-600 dark:text-secondary-200 dark:fill-secondary-200",
    tertiary:
      "text-tertiary-600 fill-tertiary-600 dark:text-tertiary-200 dark:fill-tertiary-200",
    error:
      "text-error-600 fill-error-600 dark:text-error-200 dark:fill-error-200",
  },
  elevated: {
    primary:
      "text-primary-600 fill-primary-600 shadow-lg dark:text-primary-200 dark:fill-primary-200 dark:shadow-none",
    secondary:
      "text-secondary-600 fill-secondary-600 shadow-lg dark:text-secondary-200 dark:fill-secondary-200 dark:shadow-none",
    tertiary:
      "text-tertiary-600 fill-tertiary-600 shadow-lg dark:text-tertiary-200 dark:fill-tertiary-200 dark:shadow-none",
    error:
      "text-error-600 fill-error-600 shadow-lg dark:text-error-200 dark:fill-error-200 dark:shadow-none",
  },
} as const;

export default function Button(
  { children, kind = "filled", color = "primary", icon, type }: ButtonProps,
) {
  return (
    <button
      className={`flex items-center h-10 ${
        !icon ? "px-6" : "pl-4 pr-6 gap-x-2"
      } rounded-full ${config[kind][color]}`}
      type={type}
    >
      {icon && <Add height={18} width={18} />}
      {children}
    </button>
  );
}
