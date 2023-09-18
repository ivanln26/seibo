import Link from "next/link";

import { db } from "@/db/db";

export const revalidate = 0;

export default async function Page() {
  const schools = await db.query.school.findMany();

  return (
    <ul>
      {schools.map((school) => (
        <li>
          <Link href={school.slug}>{school.name}</Link>
        </li>
      ))}
    </ul>
  );
}
