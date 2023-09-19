import { db } from "@/db/db";
import { schedule } from "@/db/schema";
import { eq } from "drizzle-orm";

type Props = {
    params: {
      id: number;
    };
  };

export default async function Page({ params }: Props){

    const sched = await db.select().from(schedule).where(eq(schedule.id, params.id))
    
    return (
        <>
        <h1 className="text-4xl">Modificar Horario</h1>
        </>
    )
}