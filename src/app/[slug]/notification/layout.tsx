import SideNavigation from "./side-navigation";

type Props = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

export default function NotificationLayout({ children, params }: Props) {
  return (
    <div className="flex flex-col md:flex-row">
      <SideNavigation slug={params.slug} />
      <section className="w-full py-2 md:px-2 md:py-0">
        {children}
      </section>
    </div>
  );
}
