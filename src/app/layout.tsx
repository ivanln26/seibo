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
      <body className="dark:text-white dark:bg-neutral-900">{children}</body>
    </html>
  );
}
