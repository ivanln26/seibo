
import Modal from "@/components/modal"
import { db } from "@/db/db"
import { getUserProfile } from "@/db/queries"
import { classroom, course, grade, instance, schoolUser, user } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { z } from "zod"

type Props = {
    params: {
        slug: string,
    }
}
export default async function Page({ params }: Props) {
    const profile = await getUserProfile({ slug: params.slug })
    const school = await db.query.school.findFirst({
        where: (school, { eq }) => eq(school.slug, params.slug)
    })
    if (!profile || !school) return <>Error</>

    const instances = await db.select().from(instance)
        .innerJoin(course, eq(instance.courseId, course.id))
        .innerJoin(grade, eq(instance.gradeId, grade.id))
        .innerJoin(user, eq(instance.professorId, user.id))
        .innerJoin(classroom, eq(instance.classroomId, classroom.id))


    const createInstanceData = {
        courses: await db.select().from(course).where(eq(course.schoolId, school.id)),
        grades: await db.select().from(grade).where(eq(grade.schoolId, school.id)),
        users: await db.select().from(user).innerJoin(schoolUser, eq(user.id, schoolUser.userId))
            .where(and(
                eq(schoolUser.schoolId, school.id),
                and(eq(schoolUser.isActive, true), eq(schoolUser.role, "teacher"))
            )),
        classrooms: await db.select().from(classroom).where(eq(classroom.schoolId, school.id)),
    }

    async function createInstance(data: FormData) {
        "use server"
        const newInstance = z.object({
            courseId: z.number(),
            gradeId: z.number(),
            classroomId: z.number(),
            professorId: z.number(),
        }).safeParse({
            courseId: Number(data.get("courseId")),
            gradeId: Number(data.get("gradeId")),
            classroomId: Number(data.get("classroomId")),
            professorId: Number(data.get("professorId"))
        });
        if (!newInstance.success) return;

        await db.insert(instance).values(newInstance.data);
        revalidatePath(`/${params.slug}/admin/instance`)
    }

    return (
        <>
            <h1 className="text-4xl">Clases</h1>
            <table>
                <tbody>
                    <tr className="bg-primary-100">
                        <td className="border border-black">Materia</td>
                        <td className="border border-black">Curso</td>
                        <td className="border border-black">Profesor</td>
                        <td className="border border-black">Aula</td>
                    </tr>
                    {instances.map((i) => (
                        <tr>
                            <td className="border border-black"><Link href={`/${params.slug}/admin/instance/${i.instance.id}`}>{i.course.name}</Link></td>
                            <td className="border border-black"><Link href={`/${params.slug}/admin/instance/${i.instance.id}`}>{i.grade.name}</Link></td>
                            <td className="border border-black"><Link href={`/${params.slug}/admin/instance/${i.instance.id}`}>{i.user.name}</Link></td>
                            <td className="border border-black"><Link href={`/${params.slug}/admin/instance/${i.instance.id}`}>{i.classroom.name}</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form className="fixed bottom-10 right-10" action={createInstance}>
                <Modal buttonText="Crear" confirmButton={{ text: "Crear", type: "submit" }}>
                    <h1 className="text-2xl">Crear clase</h1>
                    <div className="flex flex-col gap-3">
                        <label htmlFor="">Materia</label>
                        <select className="py-4 outline outline-1 outline-outline bg-transparent rounded" name="courseId" id="">
                            <option value="">---</option>
                            {createInstanceData.courses.map((c) => (<option value={c.id}>{c.name}</option>))}
                        </select>
                        <label htmlFor="">Curso</label>
                        <select className="py-4 outline outline-1 outline-outline bg-transparent rounded" name="gradeId" id="">
                            <option value="">---</option>
                            {createInstanceData.grades.map((c) => (<option value={c.id}>{c.name}</option>))}
                        </select>
                        <label htmlFor="">Profesor</label>
                        <select className="py-4 outline outline-1 outline-outline bg-transparent rounded" name="professorId" id="">
                            <option value="">---</option>
                            {createInstanceData.users.map((c) => (<option value={c.user.id}>{c.user.name}</option>))}
                        </select>
                        <label htmlFor="">Aula</label>
                        <select className="py-4 outline outline-1 outline-outline bg-transparent rounded" name="classroomId" id="">
                            <option value="">---</option>
                            {createInstanceData.classrooms.map((c) => (<option value={c.id}>{c.name}</option>))}
                        </select>
                    </div>
                </Modal>
            </form>
        </>
    )
}