"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { deleteAdminModel, updateAdminModel } from "@/app/actions";
import type {
  DeleteAdminModelResult,
  UpdateAdminModelResult,
} from "@/app/actions";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";
import type { Course } from "@/db/schema";

type Props = {
  slug: string;
  course: Course;
};

const updateInitialState: UpdateAdminModelResult<"classroom"> = {
  success: true,
  message: "",
};

const deleteInitialState: DeleteAdminModelResult = {
  success: true,
  message: "",
};

export default function Form({ slug, course }: Props) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const updateAction = updateAdminModel.bind(
    null,
    "course",
    slug,
    course.id,
  );
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
  );

  const deleteAction = deleteAdminModel.bind(
    null,
    "course",
    slug,
    course.id,
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
          defaultValue={course.name}
          required
        />
        <TextField
          id="topics"
          name="topics"
          label="Temas"
          defaultValue={course.topics}
        />
        <SubmitButton title="Guardar" />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
