import Link from "next/link";

import { getUserSchools } from "@/db/queries";
import Button from "@/components/button";

export const revalidate = 0;

export default async function Page() {
  const schools = await getUserSchools();

  return (
    <main className="flex justify-center items-center w-full h-[100svh] px-4 md:px-0">
      <section className="flex flex-col justify-center items-center gap-y-8 px-4 py-8 rounded bg-primary-100 dark:bg-primary-700">
        <h1 className="text-2xl text-center text-primary-900 md:text-4xl dark:text-primary-100">
          Escuela a Representar
        </h1>
        <ul className="flex flex-col items-center gap-y-2">
          {schools.map((school) => (
            <li key={school.id}>
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
