import Link from "next/link";

import { db } from "@/db/db";
import Button from "@/components/button";

export const revalidate = 0;

export default async function Page() {
  const schools = await db.query.school.findMany();

  return (
    <main className="flex justify-center items-center w-full h-[100svh]">
      <section className="flex flex-col justify-center items-center gap-y-8 px-4 py-8 bg-primary-100 dark:bg-primary-700 rounded-xl">
        <h1 className="text-4xl text-primary-900 dark:text-primary-100">
          Escuela a Representar
        </h1>
        <ul className="flex flex-col items-center gap-y-2">
          {schools.map((school) => (
            <li>
              <Button>
                <Link href={school.slug}>{school.name}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
