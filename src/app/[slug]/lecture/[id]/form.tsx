"use client";

import { Fragment } from "react";
import { useFormState } from "react-dom";

import UndoButton from "./undo-button";
import { updateAssistances } from "@/app/actions";
import Checkbox from "@/components/checkbox";
import Modal from "@/components/modal";
import TextArea from "@/components/text-area";

type Attendance = {
  id: number | null;
  name: string;
  surname: string;
  isPresent: boolean;
  studentId: number;
  lectureId: number;
};

const initialState: { success: boolean } = {
  success: true,
};

type Props = {
  slug: string;
  lectureID: number;
  attendances: Attendance[];
  notes: string;
};

export default function Form({ slug, lectureID, attendances, notes }: Props) {
  const updateLectureAssistances = updateAssistances.bind(
    null,
    slug,
    lectureID,
  );
  const [_, formAction] = useFormState(
    updateLectureAssistances,
    initialState,
  );

  return (
    <form action={formAction}>
      {attendances.map((attendance, i) => (
        <Fragment key={attendance.studentId}>
          <div className="flex justify-between items-center py-1">
            <label
              className="text-2xl font-mono"
              htmlFor={attendance.id === null
                ? `student-${attendance.studentId}`
                : `attendance-${attendance.id}`}
            >
              {attendance.surname}, {attendance.name}
            </label>
            <Checkbox
              id={attendance.id === null
                ? `student-${attendance.studentId}`
                : `attendance-${attendance.id}`}
              name={attendance.id === null
                ? `student-${attendance.studentId}`
                : `attendance-${attendance.id}`}
              checked={attendance.isPresent}
            />
          </div>
          {i + 1 !== attendances.length && (
            <hr className="border border-neutral-variant-50 dark:border-neutral-variant-60" />
          )}
        </Fragment>
      ))}
      <TextArea
        id="notes"
        name="notes"
        label="Notas"
        defaultValue={notes}
      />
      <div className="fixed bottom-2 right-5 flex flex-row gap-5">
        {/* <UndoButton lectureID={lectureID} /> */}
        <Modal
          buttonText="Guardar"
          confirmButton={{ text: "Guardar", type: "submit" }}
        >
          <h1 className="text-2xl">
            ¿Segur@ que desea guardar los cambios?
          </h1>
        </Modal>
      </div>
    </form>
  );
}
