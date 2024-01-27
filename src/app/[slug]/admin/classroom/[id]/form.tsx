"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { deleteAdminModel, updateAdminClassroom } from "@/app/actions";
import type {
  DeleteAdminModelResult,
  UpdateAdminClassroomResult,
} from "@/app/actions";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";

const updateInitialState: UpdateAdminClassroomResult = {
  success: true,
  message: "",
};

const deleteInitialState: DeleteAdminModelResult = {
  success: true,
  message: "",
};

type Props = {
  slug: string;
  classroom: {
    id: number;
    name: string;
  };
};

export default function Form({ slug, classroom }: Props) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const updateAction = updateAdminClassroom.bind(
    null,
    slug,
    classroom.id,
  );
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
  );

  const deleteAction = deleteAdminModel.bind(
    null,
    "classroom",
    slug,
    classroom.id,
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
          <SubmitButton title="Eliminar" color="error" icon="delete" />
        </form>
      </div>
      <form action={updateFormAction}>
        <TextField
          id="name"
          name="name"
          label="Nombre"
          defaultValue={classroom.name}
          required
        />
        <SubmitButton title="Guardar" />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
