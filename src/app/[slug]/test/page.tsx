import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

import Modal from "@/components/modal";
import Select from "@/components/select";
import TextArea from "@/components/text-area";
import TextField from "@/components/text-field";
import { db } from "@/db/db";
import { course, grade, instance, schoolUser, test, user } from "@/db/schema";
import type { Course, Grade, Test } from "@/db/schema";
import { getUserProfile } from "@/db/queries";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: Props) {
  const u = await getUserProfile({ slug: params.slug });

  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (school === undefined) {
    redirect(`/${params.slug}`);
  }

  const terms = [
    {
      start: school.settings?.terms.first.start || "2024-01-01",
      end: school.settings?.terms.first.end || "2024-05-31",
    },
    {
      start: school.settings?.terms.second.start || "2024-06-01",
      end: school.settings?.terms.second.end || "2024-08-31",
    },
    {
      start: school.settings?.terms.third.start || "2024-09-01",
      end: school.settings?.terms.third.end || "2024-12-31",
    },
  ];

  const queries: { test: Test; course: Course; grade: Grade }[][] = [];

  for (const { start, end } of terms) {
    const query = await db
      .selectDistinct({ test, course, grade })
      .from(test)
      .innerJoin(instance, eq(test.instanceId, instance.id))
      .innerJoin(course, eq(instance.courseId, course.id))
      .innerJoin(grade, eq(instance.gradeId, grade.id))
      .innerJoin(user, eq(instance.professorId, user.id))
      .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
      .where(and(
        eq(schoolUser.schoolId, school.id),
        eq(user.id, u.id),
        sql`STR_TO_DATE(test.date, "%Y-%m-%d") BETWEEN ${start} AND ${end}`,
      ));
    queries.push(query);
  }

  const instances = await db
    .selectDistinct({ instance, grade, course })
    .from(instance)
    .innerJoin(course, eq(instance.courseId, course.id))
    .innerJoin(grade, eq(instance.gradeId, grade.id))
    .innerJoin(user, eq(instance.professorId, user.id))
    .innerJoin(schoolUser, eq(user.id, schoolUser.userId))
    .where(and(
      eq(schoolUser.schoolId, school.id),
      eq(user.id, u.id),
    ));

  async function createTest(data: FormData) {
    "use server";
    const testType = z.object({
      title: z.string(),
      topics: z.string(),
      instanceId: z.coerce.number(),
      date: z.coerce.date()
        .transform((val) => val.toISOString().substring(0, 10)),
    });

    const newTest = testType.safeParse({
      title: data.get("title"),
      topics: data.get("topics"),
      instanceId: data.get("instance"),
      date: data.get("date"),
    });

    if (!newTest.success) {
      return;
    }

    await db.insert(test).values({ ...newTest.data });
    revalidatePath(`/${params.slug}/test`);
  }

  const formatDate = (date: string) => {
    // Date string format: "2024-01-01"
    const [_, m, d] = date.split("-");
    return `${d}/${m}`;
  };

  return (
    <>
      <h1 className="text-4xl font-bold">Exámenes</h1>
      <div className="flex flex-row justify-center gap-5 flex-wrap lg:flex-nowrap">
        {queries.map((term, i) => (
          <div className="flex flex-col gap-2 basis-full lg:basis-1/3" key={i}>
            <div>
              <h2 className="text-2xl">{i + 1}° Trimestre</h2>
              <p className="text-xl">
                {formatDate(terms[i].start)} - {formatDate(terms[i].end)}
              </p>
            </div>
            {term.map(({ test, course, grade }, j) => (
              <Link href={`/${params.slug}/test/${test.id}`} key={j}>
                <div className="flex flex-col p-2 rounded bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100">
                  <p className="font-bold text-xl">{test.title}</p>
                  <p>{course.name} | {grade.name}</p>
                  <p>{formatDate(test.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <form className="fixed bottom-10 right-10" action={createTest}>
        <Modal
          confirmButton={{ text: "Guardar", type: "submit" }}
          buttonText="Crear"
        >
          <div className="flex flex-col gap-2">
            <TextField id="title" name="title" label="Título" required />
            <Select
              id="instance"
              name="instance"
              label="Clase"
              required
              options={instances.map(({ instance, course, grade }) => ({
                value: instance.id,
                description: `${course.name} ${grade.name}`,
              }))}
            />
            <TextArea id="topics" name="topics" label="Temas" required />
            <TextField
              id="date"
              name="date"
              label="Fecha"
              required
              type="date"
            />
          </div>
        </Modal>
      </form>
    </>
  );
}
