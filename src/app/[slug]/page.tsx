import Button from "@/components/button";
import { db } from "@/db/db";
import { getUserProfile } from "@/db/queries";
import Link from "next/link";

export const revalidate = 0;

type Props = {
  params: {
    slug: string;
  };
};

export default async function Home({ params }: Props) {
  const school = await db.query.school.findFirst({
    where: (school, { eq }) => eq(school.slug, params.slug),
  });

  if (!school) {
    return <>No se encontró la escuela.</>;
  }

  const user = await getUserProfile({ slug: params.slug });
  if (!user) return <>Error al obtener el usuario.</>

  return (
    <section>
      <div className="container mx-auto mt-8 p-8 bg-white rounded-xl outline outline-1 outline-outline shadow">

        <h1 className="text-4xl font-bold mb-4">Bienvenido a SEIBO &#128394;</h1>
        <p className="text-gray-600 mb-8">Gestiona fácilmente la información de la institución <b>{school.name}</b></p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {
            user.profiles.find((u) => u.role === "teacher") &&
            <>
              <div className="bg-primary-100 p-6 rounded-xl outline outline-1 outline-outline flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2 text-primary-800">Asistencias</h2>
                </div>
                <div>
                  <p className="text-gray-700">Toma asistencia de tus clases, anota observaciones sobre las mismas.</p>
                </div>
                <div className="px-4 py-2">
                  <Link href={`${params.slug}/lecture`}><Button color="primary">Ver detalle</Button></Link>
                </div>
              </div>


              <div className="bg-primary-100 p-6 rounded-xl outline outline-1 outline-outline flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2 text-primary-800">Examenes</h2>
                </div>
                <div>
                  <p className="text-gray-700">Registra información acerca de los examenes de tus materias y los resultados de los alumnos.</p>
                </div>
                <div className="px-4 py-2">
                  <Link href={`${params.slug}/test`}><Button color="primary">Ver detalle</Button></Link>
                </div>
              </div>
            </>
          }

          {
            (user.profiles.find((p) => p.role === "teacher")
              || user.profiles.find((p) => p.role === "admin"
                || user.profiles.find((p) => p.role === "principal")))
            &&
            <>
              <div className="bg-primary-100 p-6 rounded-xl outline outline-1 outline-outline flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2 text-primary-800">Horarios</h2>
                </div>
                <div>
                  <p className="text-gray-700">Revisa tus horarios en la institución</p>
                </div>
                <div className="px-4 py-2">
                  <Link href={`${params.slug}/schedule`}><Button color="primary">Ver detalle</Button></Link>
                </div>
              </div>

              <div className="bg-primary-100 p-6 rounded-xl outline outline-1 outline-outline flex flex-col justify-between space-between">
                <h2 className="text-xl font-bold mb-2 text-primary-800">Notificaciones</h2>
                <p className="text-gray-700">Envia e-mails a los tutores de los alumnos.</p>
                <div className="px-4 py-2">
                  <Link href={`${params.slug}/notification`}><Button color="primary">Ver detalle</Button></Link>
                </div>
              </div>
            </>
          }

          {
            (user.profiles.find((p) => p.role === "admin") || user.profiles.find((p) => p.role === "principal")) &&
            <>
              <div className="bg-secondary-100 p-6 rounded-xl outline outline-1 outline-outline flex flex-col justify-between space-between">
                <h2 className="text-xl font-bold mb-2 text-secondary-800">Reportes</h2>
                <p className="text-gray-700">Visualiza e imprime reportes con indicadores y estadisticas relevantes.</p>
                <div className="px-4 py-2">
                  <Link href={`${params.slug}/dashboard`}><Button color="secondary">Ver detalle</Button></Link>
                </div>
              </div>

              <div className="bg-secondary-100 p-6 rounded-xl outline outline-1 outline-outline flex flex-col justify-between space-between">
                <h2 className="text-xl font-bold mb-2 text-secondary-800">Admin</h2>
                <p className="text-gray-700">Administra la información general del colegio y del sistema.</p>
                <div className="px-4 py-2">
                  <Link href={`${params.slug}/admin`}><Button color="secondary">Ver detalle</Button></Link>
                </div>
              </div>
            </>
          }

        </div>
      </div>
    </section>
  );
}
