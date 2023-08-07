"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import Button from "@/components/button";

type ModalProps = {
  buttonText: string;
  children: ReactNode;
};

export default function Modal({ buttonText, children }: ModalProps) {
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
          className="p-5 m-5 rounded bg-neutral-94 dark:bg-neutral-12"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
}
