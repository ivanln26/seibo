import Navigation from "@/components/navigation";
import { getUserProfile } from "@/db/queries";

type Props = {
  params: {
    slug: string;
  };
  children: React.ReactNode;
};

export default async function MainLayout({ params, children }: Props) {
  const u = await getUserProfile({ slug: params.slug });

  return (
    <>
      <Navigation slug={params.slug} roles={u.profiles.map((p) => p.role)} />
      <main className="w-full px-4 md:px-2 py-2">
        {children}
      </main>
    </>
  );
}
