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

function cls(
  color: Color = "primary",
  kind: Kind = "filled",
  icon?: Icon,
): string {
  let className = `flex items-center h-10 ${
    !icon ? "px-6" : "pl-4 pr-6 gap-x-2"
  } rounded-full `;
  switch (kind) {
    case "tonal":
      className += "text-[#301400] fill-[#301400] bg-[#FFDCC6]";
      break;
    case "outlined":
      className += "text-[#954A00] fill-[#954A00] border border-[#84746A]";
      break;
    case "text":
      className += "text-[#954A00] fill-[#954A00]";
      break;
    case "elevated":
      className += "text-[#954A00] fill-[#954A00] shadow-lg";
      break;
    case "filled":
    default:
      className += "text-white fill-white bg-[#954A00]";
  }
  return className;
}

export default function Button(props: ButtonProps) {
  return (
    <button
      className={cls(props.color, props.kind, props.icon)}
      type={props.type}
    >
      {props.icon && <Add height={18} width={18} />}
      {props.children}
    </button>
  );
}
