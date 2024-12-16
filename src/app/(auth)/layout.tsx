import Header from "@/components/header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
