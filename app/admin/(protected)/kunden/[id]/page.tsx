import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { MessageComposer } from "./MessageComposer";
import { MarkRepliesReadOnMount } from "./MarkRepliesReadOnMount";

export const metadata: Metadata = { title: "Kundendetails" };

export default async function AdminCustomerDetailPage({
  params,
}: PageProps<"/admin/kunden/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: customer } = await supabase.from("customers").select("*").eq("id", id).maybeSingle();
  if (!customer) notFound();

  const [{ data: orders }, { data: messages }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, status, total, created_at")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_messages")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <div>
      <MarkRepliesReadOnMount customerId={id} />
      <h1 className="font-script text-3xl text-anthracite">{customer.full_name || customer.email}</h1>
      <p className="mt-1 text-sm text-anthracite-soft">{customer.email}</p>

      {orders && orders.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
            Bestellungen
          </h2>
          <ul className="mt-2 text-sm text-anthracite-soft">
            {orders.map((order) => (
              <li key={order.id}>
                {order.order_number} · {order.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
          Nachrichtenverlauf
        </h2>
        <div className="mt-3 space-y-3">
          {(messages ?? []).map((message) => (
            <div
              key={message.id}
              className={`max-w-lg rounded-2xl px-4 py-3 text-sm ${
                message.direction === "admin_to_customer"
                  ? "ml-auto bg-anthracite text-white"
                  : "bg-cream text-anthracite"
              }`}
            >
              {message.subject && <p className="font-medium">{message.subject}</p>}
              <p className="whitespace-pre-line">{message.body}</p>
              <p className="mt-1 text-xs opacity-70">
                {new Date(message.created_at).toLocaleString("de-DE")}
              </p>
            </div>
          ))}
          {(!messages || messages.length === 0) && (
            <p className="text-sm text-anthracite-soft">Noch keine Nachrichten.</p>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-anthracite/10 pt-6">
        <h2 className="text-sm font-semibold tracking-wide text-anthracite uppercase">
          Nachricht schreiben
        </h2>
        <div className="mt-3">
          <MessageComposer customerId={id} orders={orders ?? []} />
        </div>
      </div>
    </div>
  );
}
