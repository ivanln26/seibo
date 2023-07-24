import Link from "next/link";

export type TableRow = {
  cells: TableCell[];
};

export type TableCell = {
  text: string;
  href: string;
};

export default function Table(
  { cols, rows }: { cols: String[]; rows: TableRow[] },
) {
  return (
    <div className="rounded-lg overflow-x-auto border">
      <table className="w-full">
        <thead>
          <tr className="text-on-primary">
            {cols.map((col, i) => {
              return <th className="py-1 bg-primary-100 border-b">{col}</th>;
            })}
          </tr>
        </thead>
        <tbody className="">
          {rows.map((row, i) => {
            const cells = row.cells.map((cell, i) => {
              return (
                <td className="bg-primary-container text-on-primary-container border">
                  <Link href={cell.href}>{cell.text}</Link>
                </td>
              );
            });
            return <tr key={Number(i)} className="text-center">{cells}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}
