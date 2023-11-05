import Link from "next/link";

export type TableRow = {
  cells: TableCell[];
};

export type TableCell = {
  text: string;
  href: string;
};

type TableProps = {
  slug: string;
  cols: string[];
  rows: TableRow[];
};

export default function Table({ slug, cols, rows }: TableProps) {
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr>
          {cols.map((col, i) => (
            <th
              key={i}
              className="py-1 text-primary-900 border border-neutral-variant-50 bg-primary-100 dark:text-primary-100 dark:border-neutral-variant-60 dark:bg-primary-700"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.cells.map((cell, j) => (
              <td
                key={j}
                className="text-center border border-neutral-variant-50 dark:border-neutral-variant-60"
              >
                <Link href={`/${slug}${cell.href}`}>{cell.text}</Link>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
