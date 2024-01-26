"use client";

import { useFormStatus } from "react-dom";

import Button from "@/components/button";
import type { Icon as IconType } from "@/components/icons/icon";

type Color = "primary" | "secondary" | "tertiary" | "error";

type Props = {
  title?: string;
  color?: Color;
  icon?: IconType;
};

export default function SubmitButton(
  {
    title = "Enviar",
    color = "tertiary",
    icon,
  }: Props,
) {
  const { pending } = useFormStatus();

  return (
    <>
      {!pending
        ? (
          <Button color={color} disabled={pending} icon={icon} type="submit">
            {title}
          </Button>
        )
        : (
          <svg
            className="animate-spin h-7 w-7 fill-red"
            height="24"
            width="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="opacity-25"
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            />
            <path
              className="opacity-75"
              d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
            />
          </svg>
        )}
    </>
  );
}
