import { db } from "@/db/db";
import { instance, school, schoolUser, test, user } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { tokenToString } from "typescript";

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

    function divideTests() {
        const dividedTests: testCardData[][] = [[], [], []]
        console.log(tests)
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
                            <div className="flex flex-col hover:bg-primary-200">
                                <p className="font-bold text-xl">{t.title}</p>
                                <p>{t.date.toLocaleDateString()}</p>
                            </div>))}
                    </div>
                </div>
                <div className="basis-full lg:basis-1/3">
                    <div className="text-center">
                        <h2 className="text-2xl">2° Trimestre</h2>
                    </div>
                    <div className="flex flex-col gap-2 px-2 my-5 divide-y divide-black bg-primary-100 rounded-xl border text-center justify-center">
                        {dividedTests[1].map((t) => (
                            <div className="flex flex-col hover:bg-primary-200">
                                <p className="font-bold text-xl">{t.title}</p>
                                <p>{t.date.toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="basis-full lg:basis-1/3">
                    <div className="text-center">
                        <h2 className="text-2xl">3° Trimestre</h2>
                    </div>
                    <div className="flex flex-col gap-2 px-2 my-5 divide-y divide-black bg-primary-100 rounded-xl border text-center justify-center">
                        {dividedTests[2].map((t) => (
                            <div className="flex flex-col hover:bg-primary-200">
                                <p className="font-bold text-xl">{t.title}</p>
                                <p>{t.date.toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button className="bg-tertiary-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 fixed bottom-10 right-10" aria-label="Botón Flotante">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </>
    );
}