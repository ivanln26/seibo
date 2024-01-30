"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { updateAdminModel } from "@/app/actions";
import type { UpdateAdminModelResult } from "@/app/actions";
import type { Role } from "@/db/schema";
import Checkbox from "@/components/checkbox";
import Select from "@/components/select";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";

const roles = [
  { description: "Profesor/a", value: "teacher" },
  { description: "Preceptor/a", value: "tutor" },
  { description: "Director/a", value: "principal" },
  { description: "Administrador/a", value: "admin" },
];

const updateInitialState: UpdateAdminModelResult<"user"> = {
  success: true,
  message: "",
};

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
};

type Props = {
  slug: string;
  user: User;
};

export default function Form({ slug, user }: Props) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const updateAction = updateAdminModel.bind(
    null,
    "user",
    slug,
    user.id,
  );
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
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

  return (
    <>
      <form action={updateFormAction}>
        <TextField
          id="name"
          name="name"
          label="Nombre y apellido"
          defaultValue={user.name}
          required
        />
        <TextField
          id="email"
          name="email"
          label="E-mail"
          defaultValue={user.email}
          required
        />
        <Select
          id="role"
          name="role"
          label="Rol"
          defaultValue={user.role}
          required
          options={roles.map((role) => ({ ...role }))}
        />
        <div className="flex items-center gap-x-4 py-2">
          <label htmlFor="isActive">Está activo?</label>
          <Checkbox
            id="isActive"
            name="isActive"
            checked={user.isActive}
          />
        </div>
        <SubmitButton title="Guardar" />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
