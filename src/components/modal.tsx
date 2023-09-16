"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import Button from "@/components/button";

type Type = "button" | "submit" | "reset";

type confirmButtonProps = {
  text: string;
  type: Type;
};

type ModalProps = {
  buttonText: string;
  children: ReactNode;
  confirmButton: confirmButtonProps;
};

export default function Modal(
  { buttonText, children, confirmButton }: ModalProps,
) {
  const [hidden, setHidden] = useState(true);

  return (
    <>
      <Button
        color="tertiary"
        type="button"
        onClick={() => {
          setHidden(false);
        }}
      >
        {buttonText}
      </Button>
      <div
        className={`fixed inset-0 flex justify-center items-center transition-opacity bg-black bg-opacity-50 ${
          hidden && "hidden"
        }`}
        onClick={() => setHidden(true)}
      >
        <div
          className="flex flex-col gap-5 p-5 m-5 rounded bg-neutral-94 dark:bg-neutral-12"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
          <div className="flex flex-row gap-5 justify-center mt-5">
            <Button
              kind="tonal"
              color="error"
              type="button"
              onClick={() => {
                setHidden(true);
              }}
            >
              Cancelar
            </Button>
            <Button
              type={confirmButton.type}
              kind="tonal"
              onClick={() => {
                setHidden(true);
              }}
              color="tertiary"
            >
              {confirmButton.text}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
