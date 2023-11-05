import AdminNavigation from "@/components/admin/navigation";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default function AdminLayout({ children, params }: Props) {
  return (
    <div className="flex">
      <AdminNavigation slug={params.slug} />
      <section>
        {children}
      </section>
    </div>
  );
}
