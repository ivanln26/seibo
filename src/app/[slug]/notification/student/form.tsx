"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { sendMails } from "@/app/actions";
import type { SendMailsResult } from "@/app/actions";
import Select from "@/components/select";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import SubmitButton from "@/components/submit-button";
import TextArea from "@/components/text-area";
import TextField from "@/components/text-field";
import type { Grade, Student } from "@/db/schema";

const initialState: SendMailsResult = {
  success: true,
  message: "",
};

type Props = {
  grades: Grade[];
  students: Array<Student & { gradeId: number }>;
};

export default function Form({ grades, students }: Props) {
  const sendAllMails = sendMails.bind(null, "student");
  const [state, formAction] = useFormState(sendAllMails, initialState);

  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  useEffect(() => {
    if (state.success && state.message != "") {
      setMessages((prevArr) => [
        ...prevArr,
        { message: state.message, color: "tertiary" },
      ]);
    }
  }, [state]);

  return (
    <>
      <form action={formAction}>
        <Select
          id="grade"
          name="grade"
          label="Curso"
          required
          options={grades.map((grade) => ({
            value: grade.id,
            description: grade.name,
            key: grade.id,
          }))}
        />
        <Select
          id="student"
          name="student"
          label="Alumno"
          required
          options={students.map((student) => ({
            value: student.id,
            description: `${student.lastName}, ${student.firstName}`,
            key: student.id,
          }))}
        />
        <TextField id="subject" name="subject" label="Asunto" required />
        <TextArea id="body" name="body" label="Cuerpo" required />
        <SubmitButton />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
