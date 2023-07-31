import Switch from "@/components/switch"
import Button from "@/components/button";
import Modal from "@/components/modal";
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function Page() {

  const today = new Date();
  const monthName = format(today, 'MMMM', { locale: es });

  return (
    <div className="flex flex-col gap-5 h-screen mx-2">
      <h1 className="text-4xl">Asistencias - {today.getDay()} de {monthName} de {today.getFullYear()}</h1>
      <h2 className="text-2xl">Clases</h2>
      <div className="flex flex-row gap-5 overflow-x-auto w-screen md:w-max text-center">
        <div className="p-5 px-6 m-2 border rounded-xl w-max flex flex-col font-bold">
          <p>Matematica 1</p>
          <p>1° A</p>
          <p>Lunes</p>
          <p>08:00 - 10:00</p>
        </div>
        <div className="p-5 m-2 border rounded-xl w-max flex flex-col font-bold">
          <p>Lengua</p>
          <p>1° A</p>
          <p>Lunes</p>
          <p>08:00 - 10:00</p>
        </div>
        <div className="p-5 m-2 border rounded-xl w-max flex flex-col font-bold">
          <p>Biologia</p>
          <p>1° A</p>
          <p>Lunes</p>
          <p>08:00 - 10:00</p>
        </div>
        <div className="p-5 m-2 border rounded-xl w-max flex flex-col font-bold">
          <p>Historia</p>
          <p>1° A</p>
          <p>Lunes</p>
          <p>08:00 - 10:00</p>
        </div>
      </div>
      <section className="flex px-4 flex-col gap-2 mt-2 w-screen md:w-[1080px] ">
        <div className="flex  flex-row gap-2 pb-1 border-b w-full justify-between">
          <p className="text-xl">Gomez, Francisco</p>
          <Switch id="test1" name="test1" />
        </div>
        <div className="flex  flex-row gap-2 pb-1 border-b w-full justify-between">
          <p className="text-xl">Nuñez, Luis Ivan (cacha)</p>
          <Switch id="test2" name="test2" />
        </div>
        <div className="flex  flex-row gap-2 pb-1 border-b w-full justify-between">
          <p className="text-xl">Ghilino, Ramiro</p>
          <Switch id="test3" name="test2" />
        </div>
        <div className="flex  flex-row gap-2 pb-1 border-b w-full justify-between">
          <p className="text-xl">Bobadilla, Manuel</p>
          <Switch id="test4" name="test2" />
        </div>
        <div className="flex  flex-row gap-2 pb-1 border-b w-full justify-between">
          <p className="text-xl">Villareal, Juan</p>
          <Switch id="test5" name="test2" />
        </div>
      </section>
      <div className="fixed bottom-2 right-5 flex flex-row gap-5">
        <Button color="error" kind="tonal">Deshacer</Button>
        <Modal buttonText="Guardar">Item guardado con exito</Modal>
        {/* <Button color="tertiary" kind="tonal">Guardar</Button> */}
      </div>
    </div>
  );

}
