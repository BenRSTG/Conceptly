import type { Metadata } from "next";
import { requireCustomer } from "@/lib/auth/customer";
import { ReplyForm } from "./ReplyForm";
import { MarkReadOnMount } from "./MarkReadOnMount";

export const metadata: Metadata = { title: "Nachrichten" };

export default async function MessagesPage() {
  const { supabase, user } = await requireCustomer();

  const { data: messages } = await supabase
    .from("customer_messages")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <MarkReadOnMount />
      <h1 className="font-script text-3xl text-anthracite">Nachrichten</h1>

      <div className="mt-6 space-y-3">
        {(messages ?? []).map((message) => (
          <div
            key={message.id}
            className={`max-w-lg rounded-2xl px-4 py-3 text-sm ${
              message.direction === "customer_to_admin"
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

      <div className="mt-8 border-t border-anthracite/10 pt-6">
        <ReplyForm />
      </div>
    </div>
  );
}
