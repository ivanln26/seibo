import { redirect } from "next/navigation";
import Link from "next/link";

import { getUserSchools } from "@/db/queries";
import Button from "@/components/button";
import LogOutButton from "./[slug]/user/logout-button";

export const revalidate = 0;

export default async function Page() {
  const schools = await getUserSchools();

  if (schools.length === 1) {
    redirect(`/${schools[0].slug}`);
  }

  return (
    <main className="flex justify-center items-center w-full h-[100svh] px-4 md:px-0">
      <section className="flex flex-col justify-center items-center gap-y-8 px-4 py-8 rounded bg-primary-100 dark:bg-primary-700">
        {
          schools.length === 0 ? <><h1 className="font-bold text-2xl">Usted no esta registrad@ en ninguna institución. Por favor dirigase a la institución correspondiente.</h1>
            <LogOutButton text="Volver" />
          </> :
            <>
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
            </>
        }
      </section>
    </main>
  );
}
