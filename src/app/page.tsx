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
          <div className="flex gap-x-2 p-2">
            <Button>Filled</Button>
            <Button icon="add">Filled</Button>
            <Button color="secondary">Filled</Button>
            <Button color="secondary" icon="add">Filled</Button>
            <Button color="tertiary">Filled</Button>
            <Button color="tertiary" icon="add">Filled</Button>
            <Button color="error">Filled</Button>
            <Button color="error" icon="add">Filled</Button>
          </div>
          <div className="flex gap-x-2 p-2">
            <Button color="primary" kind="tonal">Tonal</Button>
            <Button color="primary" kind="tonal" icon="add">Tonal</Button>
            <Button color="secondary" kind="tonal">Tonal</Button>
            <Button color="secondary" kind="tonal" icon="add">Tonal</Button>
            <Button color="tertiary" kind="tonal">Tonal</Button>
            <Button color="tertiary" kind="tonal" icon="add">Tonal</Button>
            <Button color="error" kind="tonal">Tonal</Button>
            <Button color="error" kind="tonal" icon="add">Tonal</Button>
          </div>
          <div className="flex gap-x-2 p-2">
            <Button color="primary" kind="outlined">Outlined</Button>
            <Button color="primary" kind="outlined" icon="add">Outlined</Button>
            <Button color="secondary" kind="outlined">Outlined</Button>
            <Button color="secondary" kind="outlined" icon="add">
              Outlined
            </Button>
            <Button color="tertiary" kind="outlined">Outlined</Button>
            <Button color="tertiary" kind="outlined" icon="add">
              Outlined
            </Button>
            <Button color="error" kind="outlined">Outlined</Button>
            <Button color="error" kind="outlined" icon="add">Outlined</Button>
          </div>
          <div className="flex gap-x-2 p-2">
            <Button color="primary" kind="text">Text</Button>
            <Button color="primary" kind="text" icon="add">Text</Button>
            <Button color="secondary" kind="text">Text</Button>
            <Button color="secondary" kind="text" icon="add">Text</Button>
            <Button color="tertiary" kind="text">Text</Button>
            <Button color="tertiary" kind="text" icon="add">Text</Button>
            <Button color="error" kind="text">Text</Button>
            <Button color="error" kind="text" icon="add">Text</Button>
          </div>
          <div className="flex gap-x-2 p-2">
            <Button color="primary" kind="elevated">Elevated</Button>
            <Button color="primary" kind="elevated" icon="add">Elevated</Button>
            <Button color="secondary" kind="elevated">Elevated</Button>
            <Button color="secondary" kind="elevated" icon="add">
              Elevated
            </Button>
            <Button color="tertiary" kind="elevated">Elevated</Button>
            <Button color="tertiary" kind="elevated" icon="add">
              Elevated
            </Button>
            <Button color="error" kind="elevated">Elevated</Button>
            <Button color="error" kind="elevated" icon="add">Elevated</Button>
          </div>
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
