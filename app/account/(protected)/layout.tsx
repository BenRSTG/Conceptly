import { requireCustomer } from "@/lib/auth/customer";
import { AccountNav } from "@/components/account/AccountNav";

export default async function ProtectedAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCustomer();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl gap-8 px-4 py-10 sm:px-6">
      <AccountNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
