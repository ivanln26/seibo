"use client"

import { useState } from "react";
import expand from "../../../../public/expand.svg"
import Image from 'next/image';

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
}
type Props = {
    daySchedules: schedule[],
    weekday: string
}



export default function Weekday({ daySchedules, weekday }: Props) {

    const [hidden, setHidden] = useState(false);

    return (
        <>
            <div className="flex flex-row">
                <h2 className="text-2xl">{weekday}</h2>
                <Image
                    priority
                    src={expand}
                    alt="Follow us on Twitter"
                    className={!hidden ? "rotate-180" : ""}
                    onClick={() => {setHidden(!hidden)}}
                />
            </div>
            {!hidden && daySchedules.map((s) => (
                <div className=" bg-primary-100 rounded-xl outline outline-1 outline-outline flex flex-col p-2 m-2">
                    <p className="font-bold text-xl">{s.course.name}</p>
                    <p>{s.grade.name} | {s.classroom.name}</p>
                    <p>{s.schedule.startTime} - {s.schedule.endTime}</p>
                </div>
            ))}
        </>
    );
}