"use client";

import { useState } from "react";
import Image from "next/image";

import Icon from "@/components/icons/icon";

type schedule = {
  classroom: {
    id: number;
    name: string;
    schoolId: number;
  };
  grade: {
    id: number;
    name: string;
    schoolId: number;
  };
  course: {
    id: number;
    name: string;
    schoolId: number;
    topics: string;
  };
  instance: {
    id: number;
    gradeId: number;
    courseId: number;
    professorId: number;
    classroomId: number;
  };
  schedule: {
    id: number;
    instanceId: number;
    weekday: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
    startTime: string;
    endTime: string;
  };
};

type Props = {
  daySchedules: schedule[];
  weekday: string;
};

export default function Weekday({ daySchedules, weekday }: Props) {
  const [hidden, setHidden] = useState(false);

  return (
    <>
      <div className="flex gap-x-2">
        <h2 className="text-2xl">{weekday}</h2>
        <div
          className={`flex items-center cursor-pointer fill-black dark:fill-white ${
            !hidden && "rotate-180"
          }`}
          onClick={() => setHidden(!hidden)}
        >
          <Icon
            icon="expand"
            height={24}
            width={24}
          />
        </div>
      </div>
      {!hidden &&
        daySchedules.map((s, i) => (
          <div
            className="flex flex-col p-2 rounded bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100"
            key={i}
          >
            <p className="font-bold text-xl">{s.course.name}</p>
            <p>{s.grade.name} | {s.classroom.name}</p>
            <p>{s.schedule.startTime} - {s.schedule.endTime}</p>
          </div>
        ))}
    </>
  );
}
