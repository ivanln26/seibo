"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { deleteAdminModel, updateAdminModel } from "@/app/actions";
import type {
  DeleteAdminModelResult,
  UpdateAdminModelResult,
} from "@/app/actions";
import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import type { Grade } from "@/db/schema";

const updateInitialState: UpdateAdminModelResult<"grade"> = {
  success: true,
  message: "",
};

const deleteInitialState: DeleteAdminModelResult = {
  success: true,
  message: "",
};

type Props = {
  slug: string;
  grade: Grade;
};

export default function Form({ slug, grade }: Props) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const updateAction = updateAdminModel.bind(
    null,
    "grade",
    slug,
    grade.id,
  );
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
  );

  const deleteAction = deleteAdminModel.bind(
    null,
    "grade",
    slug,
    grade.id,
  );
  const [deleteState, deleteFormAction] = useFormState(
    deleteAction,
    deleteInitialState,
  );

  useEffect(() => {
    if (updateState.success && updateState.message !== "") {
      setMessages(
        (prevArr) => [...prevArr, {
          message: updateState.message,
          color: "tertiary",
        }],
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

  useEffect(() => {
    if (!deleteState.success) {
      setMessages((prevArr) => [
        ...prevArr,
        {
          message: deleteState.error,
          color: "error",
        } satisfies SnackbarMessage,
      ]);
    }
  }, [deleteState]);

  return (
    <>
      <div className="flex justify-end py-1">
        <form action={deleteFormAction}>
          <SubmitButton title="Eliminar" icon="delete" color="error" />
        </form>
      </div>
      <form action={updateFormAction}>
        <TextField
          id="name"
          name="name"
          label="Nombre"
          defaultValue={grade.name}
          required
        />
        <SubmitButton title="Guardar" />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
