"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { deleteAdminModel, updateAdminModel } from "@/app/actions";
import type {
  DeleteAdminModelResult,
  UpdateAdminModelResult,
} from "@/app/actions";
import Select from "@/components/select";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import SubmitButton from "@/components/submit-button";
import TextField from "@/components/text-field";
import type { Grade, Student, StudentContact, StudentGrade } from "@/db/schema";

const contactTypeOptions = [
  { value: "father", description: "Padre" },
  { value: "mother", description: "Madre" },
  { value: "tutor", description: "Tutor" },
  { value: "other", description: "Otro" },
];

const updateInitialState: UpdateAdminModelResult<"classroom"> = {
  success: true,
  message: "",
};

const deleteInitialState: DeleteAdminModelResult = {
  success: true,
  message: "",
};

type Props = {
  slug: string;
  student: Student;
  studentGrade: StudentGrade;
  studentContact: StudentContact | null;
  grades: Grade[];
};

export default function Form({
  slug,
  student,
  studentGrade,
  studentContact,
  grades,
}: Props) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const updateAction = updateAdminModel.bind(
    null,
    "student",
    slug,
    student.id,
  );
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
  );

  const deleteAction = deleteAdminModel.bind(
    null,
    "student",
    slug,
    student.id,
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
          id="firstName"
          name="firstName"
          label="Nombre"
          defaultValue={student.firstName}
          required
        />
        <TextField
          id="lastName"
          name="lastName"
          label="Apellido"
          defaultValue={student.lastName}
          required
        />
        <TextField
          id="email"
          name="email"
          label="E-mail"
          defaultValue={student.email}
          type="email"
          required
        />
        <TextField
          id="studentCode"
          name="studentCode"
          label="Legajo"
          defaultValue={student.studentCode}
          required
        />
        <Select
          id="studentGrade"
          name="studentGrade"
          label="Aula"
          defaultValue={studentGrade.gradeId}
          required
          options={grades.map(({ id, name }) => ({
            value: id,
            description: name,
            key: id,
          }))}
        />
        <h2 className="text-2xl">Tutor de contacto</h2>
        <TextField
          id="contactName"
          name="contactName"
          label="Nombre y apellido"
          defaultValue={studentContact?.name}
        />
        <TextField
          id="contactEmail"
          name="contactEmail"
          label="E-mail"
          defaultValue={studentContact?.email}
        />
        <TextField
          id="contactPhone"
          name="contactPhone"
          label="Telefono"
          defaultValue={studentContact?.phone}
        />
        <Select
          id="contactType"
          name="contactType"
          label="Tipo"
          defaultValue={studentContact?.type}
          options={contactTypeOptions.map((opt) => ({ ...opt }))}
        />
        <SubmitButton title="Guardar" />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
