import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Kunden" };

export default async function AdminCustomersPage() {
  const { supabase } = await requireAdmin();

  const [{ data: customers }, { data: unreadMessages }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, email, full_name, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("customer_messages").select("customer_id").eq("direction", "customer_to_admin").eq("read", false),
  ]);

  const unreadByCustomer = new Map<string, number>();
  for (const msg of unreadMessages ?? []) {
    unreadByCustomer.set(msg.customer_id, (unreadByCustomer.get(msg.customer_id) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="font-script text-3xl text-anthracite">Kunden</h1>

      <ul className="mt-6 divide-y divide-anthracite/10 rounded-2xl border border-anthracite/10">
        {(customers ?? []).map((customer) => {
          const unread = unreadByCustomer.get(customer.id) ?? 0;
          return (
            <li key={customer.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <Link href={`/admin/kunden/${customer.id}`} className="text-anthracite hover:underline">
                {customer.full_name || customer.email}
              </Link>
              <span className="text-anthracite-soft">{customer.email}</span>
              {unread > 0 && (
                <span className="rounded-full bg-anthracite px-2.5 py-1 text-xs font-medium text-white">
                  {unread} neu
                </span>
              )}
            </li>
          );
        })}
        {(!customers || customers.length === 0) && (
          <li className="px-4 py-6 text-center text-sm text-anthracite-soft">Noch keine Kunden.</li>
        )}
      </ul>
    </div>
  );
}
