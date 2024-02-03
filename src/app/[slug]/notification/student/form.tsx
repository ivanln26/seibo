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
import type { Student } from "@/db/schema";
import { UserProfile } from "@/db/queries";

const initialState: SendMailsResult = {
  success: true,
  message: "",
};

type Props = {
  user: UserProfile;
  slug: string;
  studentsByGrade: Record<string, Student[]>;
};

export default function Form({ user, slug, studentsByGrade }: Props) {
  const sendAllMails = sendMails.bind(null, user, slug, "student");
  const [state, formAction] = useFormState(sendAllMails, initialState);

  const [messages, setMessages] = useState<SnackbarMessage[]>([]);

  const [grade, setGrade] = useState<string>("");

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
          onChange={(e) => setGrade(e.target.value)}
          hasNull
          required
          options={Object.keys(studentsByGrade).map((grade) => ({
            value: grade,
            description: grade,
          }))}
        />
        <Select
          id="student"
          name="student"
          label="Alumno"
          disabled={grade === ""}
          required
          options={grade in studentsByGrade
            ? studentsByGrade[grade]?.map((student) => ({
              value: student.id,
              description: `${student.lastName}, ${student.firstName}`,
              key: student.id,
            }))
            : []}
        />
        <TextField id="subject" name="subject" label="Asunto" required />
        <TextArea id="body" name="body" label="Cuerpo" required />
        <SubmitButton />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
