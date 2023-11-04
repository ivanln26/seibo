import { db } from "@/db/db";
import { course, grade, instance, school, schoolUser, test, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Modal from "@/components/modal";
import TextField from "@/components/text-field";
import { z } from "zod";
import { revalidatePath } from "next/cache";

type Props = {
    params: {
        slug: string
    }
}

type testCardData = {
    id: number,
    title: string,
    date: Date
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

    const tests = await db.select().from(test)
        .innerJoin(instance, eq(test.instanceId, instance.id))
        .innerJoin(user, eq(instance.professorId, user.id))
        .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
        .innerJoin(school, eq(schoolUser.schoolId, school.id))
        .where(and(eq(user.id, u.id), eq(school.slug, params.slug)))

    const instances = await db.select().from(instance)
        .innerJoin(user, eq(instance.professorId, user.id))
        .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
        .innerJoin(school, eq(schoolUser.schoolId, school.id))
        .innerJoin(grade, eq(instance.gradeId, grade.id))
        .innerJoin(course, eq(instance.courseId, course.id))
        .where(and(eq(school.slug, params.slug), eq(user.id, u.id)));

    console.log(instances)

    function divideTests() {
        const dividedTests: testCardData[][] = [[], [], []]
        for (let t of tests) {
            if (t.test.date.getMonth() <= 4) {
                dividedTests[0].push(t.test);
                continue;
            } else if (t.test.date.getMonth() <= 8 && t.test.date.getMonth()) {
                dividedTests[1].push(t.test);
                continue;
            }
            dividedTests[2].push(t.test);
        }
        return dividedTests;
    }
    async function createTest(data: FormData) {
        "use server"
        const testType = z.object({
            title: z.string(),
            topics: z.string(),
            instanceId: z.number(),
            date: z.string(),
        });

        const newTest = testType.safeParse({
            title: data.get("title"),
            topics: data.get("topics"),
            instanceId: Number(data.get("instanceId")),
            date: data.get("date"),
        });

        if (!newTest.success) {
            return;
        }
        await db.insert(test).values({ ...newTest.data, date: new Date(newTest.data.date) });
        revalidatePath(`/${params.slug}/student`);
    }
    const dividedTests = divideTests();
    return (
        <>
            <h1 className="text-4xl">Examenes</h1>
            <div className="flex flex-row justify-center gap-5 flex-wrap lg:flex-nowrap">
                <div className="basis-full lg:basis-1/3">
                    <div className="text-center">
                        <h2 className="text-2xl">1° Trimestre</h2>
                    </div>
                    <div className="flex flex-col gap-2 px-2 my-5 divide-y divide-black bg-primary-100 rounded-xl border text-center justify-center">
                        {dividedTests[0].map((t) => (
                            <Link href={`/${params.slug}/test/${t.id}`}>
                                <div className="flex flex-col hover:bg-primary-200">
                                    <p className="font-bold text-xl">{t.title}</p>
                                    <p>{t.date.toLocaleDateString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="basis-full lg:basis-1/3">
                    <div className="text-center">
                        <h2 className="text-2xl">2° Trimestre</h2>
                    </div>
                    <div className="flex flex-col gap-2 px-2 my-5 divide-y divide-black bg-primary-100 rounded-xl border text-center justify-center">
                        {dividedTests[1].map((t) => (
                            <Link href={`/${params.slug}/test/${t.id}`}>
                                <div className="flex flex-col hover:bg-primary-200">
                                    <p className="font-bold text-xl">{t.title}</p>
                                    <p>{t.date.toLocaleDateString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="basis-full lg:basis-1/3">
                    <div className="text-center">
                        <h2 className="text-2xl">3° Trimestre</h2>
                    </div>
                    <div className="flex flex-col gap-2 px-2 my-5 divide-y divide-black bg-primary-100 rounded-xl border text-center justify-center">
                        {dividedTests[2].map((t) => (
                            <Link href={`/${params.slug}/test/${t.id}`}>
                                <div className="flex flex-col hover:bg-primary-200">
                                    <p className="font-bold text-xl">{t.title}</p>
                                    <p>{t.date.toLocaleDateString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <form className="fixed bottom-10 right-10" action={createTest}>
                <Modal confirmButton={{ text: "Guardar", type: "submit" }} buttonText="Crear" >
                    <div className="flex flex-col gap-2">
                        <TextField id="title" name="title" label="Titulo"></TextField>
                        <label className="mt-1">Clase</label>
                        <select className="bg-transparent py-4 outline outline-1 outline-outline rounded" name="instanceId">
                            <option value="--">---</option>
                            {instances.map((i) => (<option value={Number(i.instance.id)}>{i.course.name} | {i.grade.name}</option>))}
                        </select>
                        <TextField id="topics" name="topics" label="Temas"></TextField>
                        <label className="mt-1">Fecha</label>
                        <input name="date" className="bg-transparent py-3 outline outline-1 outline-outline rounded" type="date" placeholder="dd-mm-yyyy" />
                    </div>
                </Modal>
            </form>
        </>
    );
}