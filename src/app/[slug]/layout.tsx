import Navigation from "@/components/navigation";

export default function MainLayout({
  params,
  children,
}: {
  params: {
    slug: string;
  };
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation slug={params.slug} />
      <main className="w-full px-4 md:px-2 py-2">
        {children}
      </main>
    </>
  );
}
