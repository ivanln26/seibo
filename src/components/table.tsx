import Link from "next/link";

type TableProps<TData> = {
  title: string;
  data: TData[];
  columns: {
    attr: keyof TData;
    name: string;
  }[];
  href: string;
  detail: keyof TData;
  page: number;
};

export default function Table<TData,>({
  title,
  data,
  columns,
  href,
  detail,
  page,
}: TableProps<TData>) {
  return (
    <div className="flex flex-col gap-y-2 p-4 rounded-lg outline outline-1 outline-outline">
      <h1 className="text-4xl">{title}</h1>
      <table className="table-auto w-full">
        <thead className="bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100">
          <tr>
            {columns.map(({ name }) => (
              <th className="border border-outline">{name}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-neutral-99 dark:bg-neutral-4">
          {data.map((row) => (
            <tr>
              {columns.map(({ attr }, i) => (
                i === 0
                  ? (
                    <td className="px-2 py-1 border border-outline">
                      <Link
                        className="block w-full font-bold underline text-center text-secondary-600 dark:text-secondary-200"
                        href={`${href}/${row[detail]}`}
                      >
                        {JSON.stringify(row[attr])}
                      </Link>
                    </td>
                  )
                  : (
                    <td className="px-2 py-1 border border-outline">
                      {JSON.stringify(row[attr])}
                    </td>
                  )
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="flex gap-x-4 px-2 justify-end">
        <li className="py-1">
          <Link href={`${href}?page=${page - 1}`}>
            Prev
          </Link>
        </li>
        <li className="px-3 py-1 rounded-full bg-primary-100 text-primary-900 dark:bg-primary-700 dark:text-primary-100">
          {page}
        </li>
        <li className="py-1">
          <Link href={`${href}?page=${page + 1}`}>
            Next
          </Link>
        </li>
      </ul>
    </div>
  );
}
