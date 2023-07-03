import RailButtons from "@/components/rail-buttons";

export default function NavigationRail() {
  return (
    <nav className="w-20 h-screen hidden md:block">
      <ul className="flex flex-col gap-y-3">
        <RailButtons />
      </ul>
    </nav>
  );
}
