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
import type { Grade } from "@/db/schema";
import type { UserProfile } from "@/db/queries";

const initialState: SendMailsResult = {
  success: true,
  message: "",
};

type Props = {
  user: UserProfile;
  slug: string;
  grades: Grade[];
};

export default function Form({ user, slug, grades }: Props) {
  const sendAllMails = sendMails.bind(null, user, slug, "grade");
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
        <TextField id="subject" name="subject" label="Asunto" required />
        <TextArea id="body" name="body" label="Cuerpo" required />
        <SubmitButton />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
