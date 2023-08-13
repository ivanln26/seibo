import Switch from "@/components/switch";

type props = {
  firstName: string;
  lastName: string;
  id: string;
  isPresent: boolean | undefined;
};

export default async function AssistanceRow(
  {
    firstName,
    lastName,
    id,
    isPresent = false,
  }: props,
) {
  return (
    <div className="flex  flex-row gap-2 pb-1 border-b w-full justify-between">
      <p className="text-xl">{lastName}, {firstName}</p>
      <Switch id={id} name={id} checked={isPresent} />
    </div>
  );
}
