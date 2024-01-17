"use client";

import Button from "@/components/button";
import { useState } from "react";

enum options {
  all = 1,
  specific = 2,
  grade = 3,
  null = 0,
}

type Props = {
  students: {
    student: {
      id: number;
      email: string;
      schoolId: number;
      studentCode: string;
      firstName: string;
      lastName: string;
    };
    grade: {
      id: number;
      schoolId: number;
      name: string;
    };
    student_grade: {
      id: number;
      studentId: number;
      gradeId: number;
    };
  }[];
  grades: {
    name: string;
    id: number;
    schoolId: number;
  }[];
  roles: {
    role: "teacher" | "tutor" | "principal" | "admin";
  }[];
};

export default function EmailSender({ students, grades, roles }: Props) {
  const [option, setOption] = useState<options>(options.null);
  const [grade, setGrade] = useState<number>(0);

  return (
    <div className="flex flex-col gap-5 px-5 w-full">
      <div className="flex flex-col gap-1">
        <label htmlFor="">Seleccione una opción:</label>
        <select
          onChange={(e) => setOption(Number(e.target.value) as options)}
          name="option"
          id=""
          className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
        >
          <option value={0}>---</option>
          <option value={options.specific}>
            Notificar a los tutores de un alumno
          </option>
          <option value={options.grade}>
            Notificar a todos los tutores de un curso
          </option>
          {roles.find((r) => r.role === "admin") &&
            <option value={options.all}>Notificar a todos los tutores</option>}
        </select>
      </div>
      {option === options.all &&
        (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Asunto</label>
              <input
                name="subject"
                type="text"
                className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Texto</label>
              <textarea
                name="optText"
                id=""
                className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
              >
              </textarea>
            </div>
          </>
        )}
      {option == options.grade &&
        (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Curso</label>
              <select
                onChange={(e) => setGrade(Number(e.target.value))}
                name="grade"
                className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
              >
                <option value="">---</option>
                {grades.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <label htmlFor="">Asunto</label>
                <input
                  name="subject"
                  type="text"
                  className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="">Texto</label>
                <textarea
                  name="optText"
                  id=""
                  className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
                >
                </textarea>
              </div>
            </div>
          </>
        )}
      {option === options.specific &&
        (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Curso</label>
              <select
                onChange={(e) => setGrade(Number(e.target.value))}
                name="grade"
                className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
              >
                <option value="">---</option>
                {grades.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <label htmlFor="">Alumno</label>
              <select
                name="student"
                className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
              >
                <option value="">---</option>
                {students.filter((s) => s.grade.id === grade).map((s) => (
                  <option key={s.student.id} value={s.student.id}>
                    {s.student.lastName} {s.student.firstName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Asunto</label>
              <input
                name="subject"
                type="text"
                className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Texto</label>
              <textarea
                name="optText"
                id=""
                className="bg-transparent p-3 rounded-xl outline outline-1 outline-outline"
              >
              </textarea>
            </div>
          </>
        )}
      {option !== 0 &&
        (
          <div className="flex justify-center">
            <Button type="submit" color="tertiary">Enviar</Button>
          </div>
        )}
    </div>
  );
}
