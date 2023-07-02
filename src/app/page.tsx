import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

import Button from "@/components/button";
import { db } from "@/db/db";
import { course } from "@/db/schema";

export const revalidate = 0;

export default async function Home() {
  const courses = await db.select().from(course);

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

  return (
    <main>
      <section>
        <h1 className="text-4xl">Courses</h1>
        <form action={create}>
          <input name="content" type="text" />
          <input name="topics" type="text" />
          <button type="submit">submit</button>
          <br />
          <Button>Filled</Button>
          <Button icon="add">Filled</Button>
          <br />
          <Button color="primary" kind="tonal">Tonal</Button>
          <Button color="primary" kind="tonal" icon="add">Tonal</Button>
          <br />
          <Button color="primary" kind="outlined">Outlined</Button>
          <Button color="primary" kind="outlined" icon="add">Outlined</Button>
          <br />
          <Button color="primary" kind="text">Text</Button>
          <Button color="primary" kind="text" icon="add">Text</Button>
          <br />
          <Button color="primary" kind="elevated">Elevated</Button>
          <Button color="primary" kind="elevated" icon="add">Elevated</Button>
        </form>
      </section>
      <section>
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <Link href={`/todo/${course.id}`}>
                {course.name} - {course.topics}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
