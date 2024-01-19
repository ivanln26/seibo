"use client";

import { format } from "date-fns";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const today = format(new Date(), "dd/MM/yyyy");

  return (
    <>
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-bold">Asistencias</h1>
        <h2 className="text-2xl">{today}</h2>
      </div>
      {children}
    </>
  );
}
