import { promises as fs } from "fs";

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
  let logoPath = "/logo/seibo.png";
  try {
    const stat = await fs.stat(
      `${process.cwd()}/public/logo/${params.slug}.png`,
    );
    if (stat.isFile()) logoPath = `/${params.slug}.png`;
  } catch {
    // File not found.
  }

  return (
    <>
      <Navigation
        slug={params.slug}
        roles={u.profiles.map((p) => p.role)}
        logoPath={logoPath}
      />
      <main className="w-full px-4 md:px-2 py-2">
        {children}
      </main>
    </>
  );
}
