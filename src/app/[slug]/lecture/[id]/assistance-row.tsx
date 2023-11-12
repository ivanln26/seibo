import Checkbox from "@/components/checkbox";

type AssistanceRowProps = {
  firstName: string;
  lastName: string;
  id: string | null;
  isPresent: boolean | undefined;
  studentId: number;
};

export default function AssistanceRow({
  firstName,
  lastName,
  id,
  isPresent = false,
  studentId,
}: AssistanceRowProps) {
  const attendanceId = id !== "null"
    ? `attendance:${id}`
    : `student:${studentId}`;

  return (
    <div className="flex flex-row justify-between gap-2 w-full pb-1 border-b">
      <p className="text-xl">{lastName}, {firstName}</p>
      <Checkbox id={attendanceId} name={attendanceId} checked={isPresent} />
    </div>
  );
}
