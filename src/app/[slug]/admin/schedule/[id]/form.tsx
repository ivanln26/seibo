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
import type { Schedule } from "@/db/schema";

const weekdays = [
  { name: "Lunes", value: "monday" },
  { name: "Martes", value: "tuesday" },
  { name: "Miercoles", value: "wednesday" },
  { name: "Jueves", value: "thursday" },
  { name: "Viernes", value: "friday" },
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
  schedule: Schedule;
  instances: {
    id: number;
    course: string;
    grade: string;
    professor: string;
  }[];
};

export default function Form({ slug, schedule, instances }: Props) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const updateAction = updateAdminModel.bind(
    null,
    "schedule",
    slug,
    schedule.id,
  );
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
  );

  const deleteAction = deleteAdminModel.bind(
    null,
    "schedule",
    slug,
    schedule.id,
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
        <Select
          id="instance"
          name="instance"
          label="Clase"
          defaultValue={schedule.instanceId}
          options={instances.map(({ id, course, grade, professor }) => ({
            value: id,
            description: `${course} | ${grade} | ${professor}`,
            key: id,
          }))}
          required
        />
        <Select
          id="weekday"
          name="weekday"
          label="Día de semana"
          defaultValue={schedule.weekday}
          options={weekdays.map(({ name, value }) => ({
            value: value,
            description: name,
          }))}
          required
        />
        <TextField
          id="start"
          name="start"
          label="Hora de inicio"
          defaultValue={schedule.startTime}
          pattern="[0-2][0-9]:[0-5][0-9]"
          required
        />
        <TextField
          id="end"
          name="end"
          label="Hora de fin"
          defaultValue={schedule.endTime}
          pattern="[0-2][0-9]:[0-5][0-9]"
          required
        />
        <SubmitButton title="Guardar" />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
