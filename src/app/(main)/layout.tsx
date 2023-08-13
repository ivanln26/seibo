import Navigation from "@/components/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="w-full px-4 md:px-2 py-2">
        {children}
      </main>
    </>
  );
}
