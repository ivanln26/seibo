"use client";

import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

import { sendMails } from "@/app/actions";
import type { SendMailsResult } from "@/app/actions";
import Snackbar from "@/components/snackbar";
import type { SnackbarMessage } from "@/components/snackbar";
import SubmitButton from "@/components/submit-button";
import TextArea from "@/components/text-area";
import TextField from "@/components/text-field";
import type { UserProfile } from "@/db/queries";

const initialState: SendMailsResult = {
  success: true,
  message: "",
};

type Props = {
  user: UserProfile;
  slug: string;
};

export default function Form({ user, slug }: Props) {
  const sendAllMails = sendMails.bind(null, user, slug, "all");
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
        <TextField id="subject" name="subject" label="Asunto" required />
        <TextArea id="body" name="body" label="Cuerpo" required />
        <SubmitButton />
      </form>
      <Snackbar list={messages} />
    </>
  );
}
