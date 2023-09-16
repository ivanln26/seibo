import Switch from "@/components/switch";

type props = {
  firstName: string;
  lastName: string;
  id: string | null;
  isPresent: boolean | undefined;
  studentId: number;
};

export default async function AssistanceRow(
  {
    firstName,
    lastName,
    id,
    isPresent = false,
    studentId,
  }: props,
) {
  const attendanceId = id !== "null"
    ? `attendance:${id}`
    : `student:${studentId}`;
  return (
    <div className="flex  flex-row gap-2 pb-1 border-b w-full justify-between">
      <p className="text-xl">{lastName}, {firstName}</p>
      <Switch id={attendanceId} name={attendanceId} checked={isPresent} />
    </div>
  );
}
