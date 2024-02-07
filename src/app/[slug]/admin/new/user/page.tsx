"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { createAdminModel } from "@/app/actions";
import type { CreateAdminModelResult } from "@/app/actions";
import Checkbox from "@/components/checkbox";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";
import type { Role } from "@/db/schema";

const initialState: CreateAdminModelResult<"user"> = {
  success: true,
  message: "",
};

const roles: { value: Role; name: string }[] = [
  { value: "teacher", name: "Profesor" },
  { value: "tutor", name: "Preceptor" },
  { value: "principal", name: "Director" },
  { value: "admin", name: "Administrador" },
] as const;

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    isTutor?: string;
  };
};

export default function Page({ params, searchParams }: Props) {
  const createAction = createAdminModel.bind(null, "user", params.slug);
  const [createState, createFormAction] = useFormState(
    createAction,
    initialState,
  );

  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  useEffect(() => {
    if (createState.success && createState.message !== "") {
      setMessages(
        (prevArr) => [...prevArr, {
          message: createState.message,
          color: "tertiary",
        }],
      );
    } else if (!createState.success && typeof createState.error === "string") {
      const msg: SnackbarMessage = {
        message: createState.error,
        color: "error",
      };
      setMessages((prevArr) => [...prevArr, msg]);
    } else if (!createState.success && typeof createState.error === "object") {
      const msg: SnackbarMessage = {
        message: createState.error.formErrors.join(","),
        color: "error",
      };
      setMessages((prevArr) => [...prevArr, msg]);
    }
  }, [createState]);

  const isTutorChecked = searchParams.isTutor?.toLowerCase() === "true";

  return (
    <>
      <h1 className="text-4xl">Nuevo usuario</h1>
      <form action={createFormAction}>
        <TextField
          id="name"
          name="name"
          label="Nombre y Apellido"
        />
        <TextField
          id="email"
          name="email"
          label="E-mail"
        />
        <hr className="border border-neutral-variant-50 dark:border-neutral-variant-60" />
        <h2 className="text-2xl">Roles</h2>
        <ul className="flex flex-col gap-y-1 py-2">
          {roles.map(({ value, name }, i) => (
            <li className="flex items-center gap-x-2" key={i}>
              <label className="text-xl" htmlFor={value}>
                {name}
              </label>
              <Checkbox
                id={value}
                name={value}
                checked={value === "tutor" ? isTutorChecked : undefined}
              />
            </li>
          ))}
        </ul>
        <SubmitButton />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
