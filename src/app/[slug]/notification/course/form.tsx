"use client";

import Button from "@/components/button";
import TextField from "@/components/text-field";
import type { Grade } from "@/db/schema";

type Props = {
  grades: Grade[];
};

export default function Form({ grades }: Props) {
  return (
    <form>
      <div className="flex flex-col gap-y-1 group py-2">
        <label
          className="animate-all ease-in-out duration-300 group-focus-within:font-bold group-focus-within:text-primary-600 dark:group-focus-within:text-primary-200"
          htmlFor="grade"
        >
          Curso*
        </label>
        <select
          id="grade"
          name="grade"
          className="h-12 px-4 rounded bg-transparent outline outline-1 outline-outline animate-color ease-in-out duration-300 focus:outline-2 focus:outline-primary-600 dark:focus:outline-primary-200"
          required
        >
          <option value="0">-----</option>
          {grades.map((grade) => (
            <option value={grade.id} key={grade.id}>{grade.name}</option>
          ))}
        </select>
      </div>
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
      <Button color="tertiary" type="submit">Enviar</Button>
    </form>
  );
}
