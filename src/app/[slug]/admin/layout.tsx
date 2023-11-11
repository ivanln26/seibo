import AdminNavigation from "@/components/admin/navigation";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default function AdminLayout({ children, params }: Props) {
  return (
    <div className="flex flex-col md:flex-row">
      <AdminNavigation slug={params.slug} />
      <section className="w-full">
        {children}
      </section>
    </div>
  );
}
