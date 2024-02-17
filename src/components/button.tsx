import type { ReactNode } from "react";

import Icon from "@/components/icons/icon";
import type { Icon as IconType } from "@/components/icons/icon";
import type { TwColor } from "@/color";

type Color = TwColor | "tertiary" | "error";

type Kind = "filled" | "tonal" | "outlined" | "text" | "elevated";

type Type = "button" | "submit" | "reset";

type ButtonProps = {
  children: ReactNode;
  color?: Color;
  kind?: Kind;
  onClick?: () => void;
  disabled?: boolean;
  type?: Type;
  icon?: IconType;
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
    red:
      "text-white fill-white bg-red-600 dark:text-red-800 dark:fill-red-800 dark:bg-red-200",
    orange:
      "text-white fill-white bg-orange-600 dark:text-orange-800 dark:fill-orange-800 dark:bg-orange-200",
    yellow:
      "text-white fill-white bg-yellow-600 dark:text-yellow-800 dark:fill-yellow-800 dark:bg-yellow-200",
    lime:
      "text-white fill-white bg-lime-600 dark:text-lime-800 dark:fill-lime-800 dark:bg-lime-200",
    green:
      "text-white fill-white bg-green-600 dark:text-green-800 dark:fill-green-800 dark:bg-green-200",
    emerald:
      "text-white fill-white bg-emerald-600 dark:text-emerald-800 dark:fill-emerald-800 dark:bg-emerald-200",
    cyan:
      "text-white fill-white bg-cyan-600 dark:text-cyan-800 dark:fill-cyan-800 dark:bg-cyan-200",
    blue:
      "text-white fill-white bg-blue-600 dark:text-blue-800 dark:fill-blue-800 dark:bg-blue-200",
    violet:
      "text-white fill-white bg-violet-600 dark:text-violet-800 dark:fill-violet-800 dark:bg-violet-200",
    purple:
      "text-white fill-white bg-purple-600 dark:text-purple-800 dark:fill-purple-800 dark:bg-purple-200",
    fuchsia:
      "text-white fill-white bg-fuchsia-600 dark:text-fuchsia-800 dark:fill-fuchsia-800 dark:bg-fuchsia-200",
    pink:
      "text-white fill-white bg-pink-600 dark:text-pink-800 dark:fill-pink-800 dark:bg-pink-200",
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
    red:
      "text-red-900 fill-red-900 bg-red-100 dark:text-red-100 dark:fill-red-100 dark:bg-red-700",
    orange:
      "text-orange-900 fill-orange-900 bg-orange-100 dark:text-orange-100 dark:fill-orange-100 dark:bg-orange-700",
    yellow:
      "text-yellow-900 fill-yellow-900 bg-yellow-100 dark:text-yellow-100 dark:fill-yellow-100 dark:bg-yellow-700",
    lime:
      "text-lime-900 fill-lime-900 bg-lime-100 dark:text-lime-100 dark:fill-lime-100 dark:bg-lime-700",
    green:
      "text-green-900 fill-green-900 bg-green-100 dark:text-green-100 dark:fill-green-100 dark:bg-green-700",
    emerald:
      "text-emerald-900 fill-emerald-900 bg-emerald-100 dark:text-emerald-100 dark:fill-emerald-100 dark:bg-emerald-700",
    cyan:
      "text-cyan-900 fill-cyan-900 bg-cyan-100 dark:text-cyan-100 dark:fill-cyan-100 dark:bg-cyan-700",
    blue:
      "text-blue-900 fill-blue-900 bg-blue-100 dark:text-blue-100 dark:fill-blue-100 dark:bg-blue-700",
    violet:
      "text-violet-900 fill-violet-900 bg-violet-100 dark:text-violet-100 dark:fill-violet-100 dark:bg-violet-700",
    purple:
      "text-purple-900 fill-purple-900 bg-purple-100 dark:text-purple-100 dark:fill-purple-100 dark:bg-purple-700",
    fuchsia:
      "text-fuchsia-900 fill-fuchsia-900 bg-fuchsia-100 dark:text-fuchsia-100 dark:fill-fuchsia-100 dark:bg-fuchsia-700",
    pink:
      "text-pink-900 fill-pink-900 bg-pink-100 dark:text-pink-100 dark:fill-pink-100 dark:bg-pink-700",
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
    red:
      "text-red-600 fill-red-600 outline outline-1 outline-outline dark:text-red-200 dark:fill-red-200",
    orange:
      "text-orange-600 fill-orange-600 outline outline-1 outline-outline dark:text-orange-200 dark:fill-orange-200",
    yellow:
      "text-yellow-600 fill-yellow-600 outline outline-1 outline-outline dark:text-yellow-200 dark:fill-yellow-200",
    lime:
      "text-lime-600 fill-lime-600 outline outline-1 outline-outline dark:text-lime-200 dark:fill-lime-200",
    green:
      "text-green-600 fill-green-600 outline outline-1 outline-outline dark:text-green-200 dark:fill-green-200",
    emerald:
      "text-emerald-600 fill-emerald-600 outline outline-1 outline-outline dark:text-emerald-200 dark:fill-emerald-200",
    cyan:
      "text-cyan-600 fill-cyan-600 outline outline-1 outline-outline dark:text-cyan-200 dark:fill-cyan-200",
    blue:
      "text-blue-600 fill-blue-600 outline outline-1 outline-outline dark:text-blue-200 dark:fill-blue-200",
    violet:
      "text-violet-600 fill-violet-600 outline outline-1 outline-outline dark:text-violet-200 dark:fill-violet-200",
    purple:
      "text-purple-600 fill-purple-600 outline outline-1 outline-outline dark:text-purple-200 dark:fill-purple-200",
    fuchsia:
      "text-fuchsia-600 fill-fuchsia-600 outline outline-1 outline-outline dark:text-fuchsia-200 dark:fill-fuchsia-200",
    pink:
      "text-pink-600 fill-pink-600 outline outline-1 outline-outline dark:text-pink-200 dark:fill-pink-200",
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
    red: "text-red-600 fill-red-600 dark:text-red-200 dark:fill-red-200",
    orange:
      "text-orange-600 fill-orange-600 dark:text-orange-200 dark:fill-orange-200",
    yellow:
      "text-yellow-600 fill-yellow-600 dark:text-yellow-200 dark:fill-yellow-200",
    lime: "text-lime-600 fill-lime-600 dark:text-lime-200 dark:fill-lime-200",
    green:
      "text-green-600 fill-green-600 dark:text-green-200 dark:fill-green-200",
    emerald:
      "text-emerald-600 fill-emerald-600 dark:text-emerald-200 dark:fill-emerald-200",
    cyan: "text-cyan-600 fill-cyan-600 dark:text-cyan-200 dark:fill-cyan-200",
    blue: "text-blue-600 fill-blue-600 dark:text-blue-200 dark:fill-blue-200",
    violet:
      "text-violet-600 fill-violet-600 dark:text-violet-200 dark:fill-violet-200",
    purple:
      "text-purple-600 fill-purple-600 dark:text-purple-200 dark:fill-purple-200",
    fuchsia:
      "text-fuchsia-600 fill-fuchsia-600 dark:text-fuchsia-200 dark:fill-fuchsia-200",
    pink: "text-pink-600 fill-pink-600 dark:text-pink-200 dark:fill-pink-200",
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
    red:
      "text-red-600 fill-red-600 shadow-lg dark:text-red-200 dark:fill-red-200 dark:shadow-none",
    orange:
      "text-orange-600 fill-orange-600 shadow-lg dark:text-orange-200 dark:fill-orange-200 dark:shadow-none",
    yellow:
      "text-yellow-600 fill-yellow-600 shadow-lg dark:text-yellow-200 dark:fill-yellow-200 dark:shadow-none",
    lime:
      "text-lime-600 fill-lime-600 shadow-lg dark:text-lime-200 dark:fill-lime-200 dark:shadow-none",
    green:
      "text-green-600 fill-green-600 shadow-lg dark:text-green-200 dark:fill-green-200 dark:shadow-none",
    emerald:
      "text-emerald-600 fill-emerald-600 shadow-lg dark:text-emerald-200 dark:fill-emerald-200 dark:shadow-none",
    cyan:
      "text-cyan-600 fill-cyan-600 shadow-lg dark:text-cyan-200 dark:fill-cyan-200 dark:shadow-none",
    blue:
      "text-blue-600 fill-blue-600 shadow-lg dark:text-blue-200 dark:fill-blue-200 dark:shadow-none",
    violet:
      "text-violet-600 fill-violet-600 shadow-lg dark:text-violet-200 dark:fill-violet-200 dark:shadow-none",
    purple:
      "text-purple-600 fill-purple-600 shadow-lg dark:text-purple-200 dark:fill-purple-200 dark:shadow-none",
    fuchsia:
      "text-fuchsia-600 fill-fuchsia-600 shadow-lg dark:text-fuchsia-200 dark:fill-fuchsia-200 dark:shadow-none",
    pink:
      "text-pink-600 fill-pink-600 shadow-lg dark:text-pink-200 dark:fill-pink-200 dark:shadow-none",
  },
} as const;

export default function Button(
  {
    children,
    kind = "filled",
    color = "primary",
    icon,
    onClick,
    disabled = false,
    type,
  }: ButtonProps,
) {
  return (
    <button
      className={`flex items-center h-10 ${
        !icon ? "px-6" : "pl-4 pr-6 gap-x-2"
      } rounded-full ${config[kind][color]}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {icon && <Icon icon={icon} height={18} width={18} />}
      {children}
    </button>
  );
}
