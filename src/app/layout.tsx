import Navigation from "@/components/navigation";
import AuthProvider from "@/components/auth-provider";
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
      <body className="flex flex-wrap md:flex-nowrap bg-neutral-99 dark:text-white dark:bg-neutral-4">
        <AuthProvider>
          <Navigation />
          <main className="w-full px-4 md:px-2 py-2">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
