"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { updateAdminModel } from "@/app/actions";
import type { UpdateAdminModelResult } from "@/app/actions";
import Checkbox from "@/components/checkbox";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";
import type { Grade } from "@/db/schema";

const updateInitialState: UpdateAdminModelResult<"tutor"> = {
  success: true,
  message: "",
};

type User = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};

type Props = {
  slug: string;
  tutor: User & { gradeIds: number[] };
  grades: Grade[];
};

export default function Form({ slug, tutor, grades }: Props) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const updateAction = updateAdminModel.bind(
    null,
    "tutor",
    slug,
    tutor.id,
  );
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
  );

  useEffect(() => {
    if (updateState.success && updateState.message !== "") {
      setMessages(
        (prevArr) => [
          ...prevArr,
          {
            message: updateState.message,
            color: "tertiary",
          } satisfies SnackbarMessage,
        ],
      );
    }
    if (!updateState.success && typeof updateState.error === "string") {
      const msg: SnackbarMessage = {
        message: updateState.error,
        color: "error",
      };
      setMessages((prevArr) => [...prevArr, msg]);
    }
  }, [updateState]);

  return (
    <>
      <form action={updateFormAction}>
        <TextField
          id="name"
          name="name"
          label="Nombre y apellido"
          defaultValue={tutor.name}
          required
        />
        <TextField
          id="email"
          name="email"
          label="E-mail"
          defaultValue={tutor.email}
          required
        />
        <div className="flex items-center gap-x-4 py-2">
          <label htmlFor="isActive">Está activo?</label>
          <Checkbox
            id="isActive"
            name="isActive"
            checked={tutor.isActive}
          />
        </div>
        <hr className="border border-neutral-variant-50 dark:border-neutral-variant-60" />
        <h2 className="text-2xl">Cursos asociados</h2>
        <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-4 md:gap-2">
          {grades.map((grade) => (
            <div className="flex items-center gap-x-4" key={grade.id}>
              <label
                className="text-2xl font-mono"
                htmlFor={`grade-${grade.id}`}
              >
                {grade.name}
              </label>
              <Checkbox
                id={`grade-${grade.id}`}
                name={`grade-${grade.id}`}
                checked={tutor.gradeIds.includes(grade.id)}
              />
            </div>
          ))}
        </div>
        <SubmitButton title="Guardar" />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
