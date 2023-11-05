import ScoreModal from "./scoreModal";
import { db } from "@/db/db";
import { score, test, student, grade, studentGrade, instance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import TextField from "@/components/text-field";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type Props = {
    params: {
        slug: string,
        id: number
    }
}

type scoreRow = {
    name: string,
    score: number,
    id: number,
    studentId: number
}

export default async function Page({ params }: Props) {
    const session = await getServerSession();

    if (!session) {
        return <>Error al obtener la sesión.</>;
    }

    const u = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.email, session.user.email),
        with: {
            profiles: { where: (profile, { eq }) => eq(profile.isActive, true) },
        },
    });

    if (!u) {
        return <>Error al obtener el usuario de la base de datos.</>;
    }

    const exam = (await db.select().from(test).where(eq(test.id, params.id)))[0]

    async function getScores() {
        const scores: scoreRow[] = [];
        const actualScores = await db.select().from(score)
            .innerJoin(test, eq(score.testId, test.id))
            .innerJoin(student, eq(score.studentId, student.id))
            .where(eq(test.id, params.id));
        for (let s of actualScores) {
            scores.push({
                id: s.score.id,
                name: s.student.firstName + " " + s.student.lastName,
                score: s.score.score,
                studentId: s.student.id
            })
        }
        return scores;
    }

    const scores = await getScores();

    async function getRemainingStudents() {
        const missingStudents = []
        const students = await db.select({
            fistName: student.firstName,
            lastName: student.lastName,
            id: student.id
        }).from(student)
            .innerJoin(studentGrade, eq(student.id, studentGrade.studentId))
            .innerJoin(grade, eq(studentGrade.gradeId, grade.id))
            .innerJoin(instance, eq(grade.id, instance.gradeId))
            .innerJoin(test, eq(instance.id, test.instanceId))
            .where(eq(test.id, params.id));

        const studentsIds = students.map((s) => s.id);
        const scoresIds = scores.map((s) => s.studentId)
        for (let s of studentsIds) {
            if (!scoresIds.includes(s)) {
                missingStudents.push(students[studentsIds.indexOf(s)])
            }
        }
        return missingStudents;
    }

    const students = await getRemainingStudents();

    async function createScore(data: FormData) {
        "use server"
        console.log(data)
        const scoreType = z.object({
            testId: z.number(),
            studentId: z.number(),
            score: z.number()
        })

        const newScore = scoreType.safeParse({
            testId: Number(params.id),
            studentId: Number(data.get("studentId")),
            score: Number(data.get("score"))
        })
        if (!newScore.success){
            console.log(newScore.error);
            return;
        }
        await db.insert(score).values({
            score: newScore.data.score,
            studentId: newScore.data.studentId,
            testId: newScore.data.testId
        });
        revalidatePath(`/${params.slug}/test/${params.id}`)
    }
    console.log(students.length, scores.length)

    return (
        <>
            <h1 className="text-4xl">Calificaciones | Examen: {exam.title} | {exam.date.toLocaleDateString()}</h1>
            <div className="flex flex-col divide-y divide-solid divide-black bg-primary-100 rounded rounded-xl p-3">
            <form action={"dsda"} className="divide-y divide-solid divide-black">
                {scores.map((s) => (<div className="py-3 px-2 hover:bg-primary-400">{s.name} <input name={String(s.id)} className="bg-transparent" type="number" defaultValue={s.score} /></div>))}
            </form>
            {students.length != 0 ? <form action={createScore} className="py-3 px-2 hover:bg-primary-400">
                <ScoreModal>
                    <select className="bg-transparent py-4 outline outline-1 outline-outline rounded focus:outline-primary-500 focus:outline-2" name="studentId" id="">
                        <option value="">---</option>
                        {
                            students.map((m) => (<option value={Number(m.id)}>{m.lastName} {m.fistName}</option>))
                        }
                    </select>
                    <input className="bg-transparent py-3 outline outline-1 outline-outline rounded focus:outline-primary-500 focus:outline-2" type="number" name="score" id="" />
                </ScoreModal></form> : <></>}
            </div>
        </>
    )
}