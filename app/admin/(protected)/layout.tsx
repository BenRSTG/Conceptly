import { requireAdmin } from "@/lib/auth/admin";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl gap-8 px-4 py-10 sm:px-6">
      <AdminNav />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
