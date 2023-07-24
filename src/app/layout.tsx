import Navigation from "@/components/navigation";
import "./globals.css";

export const metadata = {
  title: "Seibo",
  description: "Sistema de Gestión Interna Escolar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-wrap bg-neutral-99 dark:text-white dark:bg-neutral-4">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
