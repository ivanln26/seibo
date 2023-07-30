import { redirect } from "next/navigation";
import { z } from "zod";

import Button from "@/components/button";
import TextField from "@/components/text-field";
import Table from "@/components/table";
import type { TableRow } from "@/components/table";
import { db } from "@/db/db";
import { course } from "@/db/schema";

export const revalidate = 0;

export default async function Home() {
  const courses = await db.select().from(course);
  const columnNames = Object.keys(courses[0]);

  const create = async (formData: FormData) => {
    "use server";
    const t = z.object({
      content: z.string(),
      topics: z.string(),
    });
    const res = t.safeParse({
      content: formData.get("content"),
      topics: formData.get("topics"),
    });
    if (!res.success) {
      return;
    }
    await db.insert(course).values({
      name: res.data.content,
      topics: res.data.topics,
      schoolId: 1,
    });
    redirect("/");
  };

  const createTableRows = (): TableRow[] => {
    return courses.map((course) => (
      {
        cells: Object.values(course).map((attribute) => ({
          text: String(attribute),
          href: `/todo/${course.id}`,
        })),
      }
    ));
  };

  return (
    <main>
      <section>
        <h1 className="text-4xl">Courses</h1>
        <form action={create}>
          <TextField id="content" name="content" label="Contenido" required />
          <TextField
            id="topics"
            name="topics"
            label="Temas"
            helpText="Texto de ayuda."
            icon="add"
            required
          />
          <Button type="submit">Submit</Button>
        </form>
      </section>
      <section>
        <Table cols={columnNames} rows={createTableRows()}></Table>
      </section>
    </main>
  );
}
