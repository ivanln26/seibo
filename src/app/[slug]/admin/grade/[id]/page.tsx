import { db } from "@/db/db"
import { eq } from "drizzle-orm"

import TextField from "@/components/text-field"
import { z } from "zod"
import { grade } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import Button from "@/components/button"

type Props = {
  params: {
    id: number,
    slug: string
  }
}

export default async function Page({ params }: Props) {
  const actualGrade = await db.query.grade.findFirst({
    where: (grade, { eq }) => eq(grade.id, params.id)
  })

  const actualSchool = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug)
  })

  if (!actualGrade || !actualSchool) return (<>Error</>)

  async function updateGrade(data: FormData) {
    "use server"
    const gradeType = z.object({
      name: z.string(),
      id: z.number()
    })

    const newGrade = gradeType.safeParse({
      name: data.get("name"),
      id: actualGrade?.id
    })

    if (!newGrade.success) return;

    await db.update(grade).set({
      name: newGrade.data.name
    }).where(eq(grade.id, newGrade.data.id))
    revalidatePath(`${params.slug}/admin/grade`)
    redirect(`${params.slug}/admin/grade`)
  }

  async function deleteGrade(data: FormData) {
    "use server"
    console.log(data.get("id"))
    const id = z.number().safeParse(Number(data.get("id")));
    if (!id.success) {
      console.log(id.error)
      return;}
    await db.delete(grade).where(eq(grade.id, id.data))
    revalidatePath(`${params.slug}/admin/grade`)
    redirect(`${params.slug}/admin/grade`)
  }


  return (
    <>
      <h1 className="text-4xl ml-5">Modificar curso</h1>
      <div className="bg-primary-100 flex flex-col gap-5 m-5 p-4 rounded-xl">
        <form action={updateGrade}>
          <TextField id="name" name="name" label="Nombre" defaultValue={actualGrade?.name}></TextField>
          <Button color="tertiary" type="submit">Guardar</Button>
        </form>
        <form action={deleteGrade}>
          <input type="hidden" value={params.id} name="id" />
          <Button color="error" type="submit">Borrar</Button>
        </form>
      </div>
    </>
  )
}