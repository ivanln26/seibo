"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  buttonText: string;
  children: ReactNode;
};

export default function Modal({ buttonText, children }: ModalProps) {
  const [hidden, setHidden] = useState(true);
  return (
    <>
      <button
        onClick={() => {
          setHidden(false);
        }}
        className="bg-tertiary-100 hover:bg-lime-400 px-1 text-black rounded-lg flex items-center justify-center shadow"
      >
        {buttonText}
      </button>
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
