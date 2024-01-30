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
import type { Classroom, Course, Grade, Instance, User } from "@/db/schema";

const updateInitialState: UpdateAdminModelResult<"instance"> = {
  success: true,
  message: "",
};

const deleteInitialState: DeleteAdminModelResult = {
  success: true,
  message: "",
};

type Props = {
  slug: string;
  instance: Instance;
  courses: Course[];
  classrooms: Classroom[];
  professors: User[];
  grades: Grade[];
};

export default function Form(
  {
    slug,
    instance,
    courses,
    classrooms,
    professors,
    grades,
  }: Props,
) {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const updateAction = updateAdminModel.bind(
    null,
    "instance",
    slug,
    instance.id,
  );
  const [updateState, updateFormAction] = useFormState(
    updateAction,
    updateInitialState,
  );

  const deleteAction = deleteAdminModel.bind(
    null,
    "instance",
    slug,
    instance.id,
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

  return (
    <>
      <div className="flex justify-end py-1">
        <form action={deleteFormAction}>
          <SubmitButton title="Eliminar" color="error" icon="delete" />
        </form>
      </div>
      <form action={updateFormAction}>
        <Select
          id="course"
          name="course"
          label="Materia"
          required
          defaultValue={instance.courseId}
          options={courses.map((course) => ({
            value: course.id,
            description: course.name,
            key: course.id,
          }))}
        />
        <Select
          id="classroom"
          name="classroom"
          label="Aula"
          required
          defaultValue={instance.classroomId}
          options={classrooms.map((classroom) => ({
            value: classroom.id,
            description: classroom.name,
            key: classroom.id,
          }))}
        />
        <Select
          id="professor"
          name="professor"
          label="Profesor"
          required
          defaultValue={instance.professorId}
          options={professors.map((professor) => ({
            value: professor.id,
            description: professor.name,
            key: professor.id,
          }))}
        />
        <Select
          id="grade"
          name="grade"
          label="Curso"
          required
          defaultValue={instance.gradeId}
          options={grades.map((grade) => ({
            value: grade.id,
            description: grade.name,
            key: grade.id,
          }))}
        />
        <SubmitButton title="Guardar" />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
