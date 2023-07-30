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
        onClick={() => {
          setHidden(false);
        }}
      >
        {buttonText}
      </Button>
      <div
        className={`fixed inset-0 bg-gray-200 bg-opacity-75 ${
          hidden ? "hidden" : ""
        } transition-opacity flex justify-center items-center`}
        onClick={() => setHidden(true)}
      >
        <div
          className="bg-white p-5 m-5 rounded border"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
}
