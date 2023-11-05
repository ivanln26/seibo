import { eq, sql } from "drizzle-orm";

import Canvas from "./canvas";
import { db } from "@/db/db";
import { grade, school, studentGrade } from "@/db/schema";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Page({ params } : Props) {
  const query = await db
    .select({
      gradeId: grade.id,
      grade: grade.name,
      count: sql<number>`count(${studentGrade.studentId})`,
    })
    .from(studentGrade)
    .innerJoin(grade, eq(studentGrade.gradeId, grade.id))
    .innerJoin(school, eq(grade.schoolId, school.id))
    .where(eq(school.slug, params.slug))
    .groupBy(({ gradeId }) => gradeId);

  return (
    <>
      <Canvas data={query} />
    </>
  );
}
