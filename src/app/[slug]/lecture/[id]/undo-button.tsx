"use client";

import { redirect } from "next/navigation";

import Button from "@/components/button";
import { ReactNode } from "react";

type props = {
  lectureID: number;
};

export default function UndoButton({ lectureID }: props): ReactNode {
  return (
    <Button
      color="error"
      kind="tonal"
      onClick={() => redirect(`/lecture/${lectureID}`)}
    >
      Deshacer
    </Button>
  );
}
