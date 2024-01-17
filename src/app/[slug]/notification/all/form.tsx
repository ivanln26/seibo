"use client";

import Button from "@/components/button";
import TextField from "@/components/text-field";

export default function Form() {
  return (
    <form>
      <TextField id="subject" name="subject" label="Asunto" required />
      <div className="flex flex-col gap-y-1 group py-2">
        <label
          className="animate-all ease-in-out duration-300 group-focus-within:font-bold group-focus-within:text-primary-600 dark:group-focus-within:text-primary-200"
          htmlFor="body"
        >
          Cuerpo*
        </label>
        <textarea
          id="body"
          name="body"
          className="px-4 py-2 rounded bg-transparent outline outline-1 outline-outline animate-all ease-in-out duration-300 focus:outline-2 focus:outline-primary-600 dark:focus:outline-primary-200"
          required
        />
      </div>
      <Button color="tertiary" type="submit">
        Enviar
      </Button>
    </form>
  );
}
