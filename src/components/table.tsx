import Link from "next/link";
import { z } from "zod";

import TableSearch from "./table-search";
import Icon from "@/components/icons/icon";

export const querySchema = z.object({
  page: z.coerce.number()
    .min(1, { message: "El número no puede ser menor a 1." })
    .default(1),
  limit: z.coerce.number()
    .min(1, { message: "El número no puede ser menor a 1." })
    .max(100, { message: "El número no puede ser mayor a 100." })
    .default(50),
  query: z.string().default(""),
});

const weekdays = [
  { name: "monday", value: "Lunes" },
  { name: "tuesday", value: "Martes" },
  { name: "wednesday", value: "Miercoles" },
  { name: "thursday", value: "Jueves" },
  { name: "friday", value: "Viernes" },
];

const roles = [
  { name: "teacher", value: "Profesor" },
  { name: "tutor", value: "Preceptor" },
  { name: "principal", value: "Director" },
  { name: "admin", value: "Administrador" },
];

type TableProps<TData extends Record<string, string | number>> = {
  title: string;
  data: TData[];
  columns: {
    attr: keyof TData | "icon";
    name: string;
  }[];
  href: string;
  detail: keyof TData;
  page: number;
  limit: number;
};

export default function Table<TData extends Record<string, string | number>>({
  title,
  data,
  columns,
  href,
  detail,
  page,
  limit,
}: TableProps<TData>) {
  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-4xl">{title}</h1>
      <TableSearch />
      <table className="table-auto w-full">
        <thead className="bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100">
          <tr>
            {columns.map(({ name }, i) => (
              <th className="border border-outline" key={i}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-neutral-99 dark:bg-neutral-4">
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(({ attr, name }, j) => (
                attr === "icon"
                  ? (
                    <td className="px-2 py-1 border border-outline" key={j}>
                      <Link
                        className="block w-full font-bold underline flex justify-center text-center text-secondary-600 dark:text-secondary-200"
                        href={`${href}/${row[detail]}`}
                      >
                        {name === "Detalle" ? <Icon icon="search" height={24} width={24} /> : <Icon icon="edit" height={24} width={24} />}
                      </Link>
                    </td>
                  )
                  : (
                    <td className="px-2 py-1 border border-outline" key={j}>
                      {weekdays.find((w) => w.name === row[attr])?.value ||
                      roles.find((r) => r.name === row[attr])?.value ||
                      row[attr]}
                    </td>
                  )
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end gap-x-2">
        <p className="py-1">Elementos:</p>
        <ul className="flex gap-x-2">
          {[10, 25, 50, 100].map((n, i) => (
            <li
              className={`px-3 py-1 rounded-full ${
                limit === n
                  ? "bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100"
                  : "outline outline-1 outline-outline"
              }`}
              key={i}
            >
              <Link
                href={{
                  pathname: href,
                  query: {
                    page: page,
                    limit: n,
                  },
                }}
              >
                {n}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ul className="flex gap-x-4 px-2 justify-end">
        {page !== 1 && (
          <li className="py-1">
            <Link
              href={{
                pathname: href,
                query: {
                  page: page - 1,
                  limit: limit,
                },
              }}
            >
              Anterior
            </Link>
          </li>
        )}
        <li className="px-3 py-1 rounded-full bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100">
          {page}
        </li>
        {data.length === limit && (
          <li className="py-1">
            <Link
              href={{
                pathname: href,
                query: {
                  page: page + 1,
                  limit: limit,
                },
              }}
            >
              Siguiente
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
