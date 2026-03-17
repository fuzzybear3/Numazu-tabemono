import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full flex justify-between items-center px-4 h-14 border-b border-border">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-lg">
            Admin
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View site
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <LogoutButton />
        </div>
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  );
}
