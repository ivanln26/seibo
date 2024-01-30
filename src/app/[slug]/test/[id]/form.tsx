"use client";

import { Fragment } from "react";

import { updateScores } from "@/app/actions";
import Button from "@/components/button";
import { useFormState } from "react-dom";

type Row = {
  student: {
    id: number;
    firstName: string;
    lastName: string;
  };
  score: {
    id: number;
    value: number;
  } | null;
};

type Props = {
  slug: string;
  testId: number;
  rows: Row[];
};

const initialState: { success: boolean } = {
  success: true,
};

export default function Form({ slug, testId, rows }: Props) {
  const action = updateScores.bind(null, slug, testId);
  const [_, formAction] = useFormState(action, initialState);
  const scoreValues = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <form action={formAction}>
      <ul className="flex flex-col md:max-w-[1080px]">
        {rows.map(({ student, score }, i) => (
          <Fragment key={i}>
            <li className="flex justify-between items-center py-1">
              <label
                className="text-2xl text-wrap font-mono"
                htmlFor={score !== null
                  ? `score-${score.id}`
                  : `student-${student.id}`}
              >
                {student.lastName}, {student.firstName}
              </label>
              <select
                name={score !== null
                  ? `score-${score.id}`
                  : `student-${student.id}`}
                id={score !== null
                  ? `score-${score.id}`
                  : `student-${student.id}`}
                className="px-4 py-1 rounded text-xl bg-transparent animate ease-in-out duration-300 outline outline-neutral-variant-50 dark:outline-neutral-variant-60 focus:outline-2 focus:outline-primary-600 dark:focus:outline-primary-200"
                defaultValue={score !== null ? score.value : undefined}
              >
                <option value="absent">Ausente</option>
                {scoreValues.map((num) => (
                  <option value={num} key={num}>{num}</option>
                ))}
              </select>
            </li>
            {i + 1 !== rows.length && (
              <hr className="border border-neutral-variant-50 dark:border-neutral-variant-60" />
            )}
          </Fragment>
        ))}
      </ul>
      <div className="fixed bottom-10 right-10 bg-tertiary-300 rounded-full">
        <Button color="tertiary" type="submit">Guardar</Button>
      </div>
    </form>
  );
}
