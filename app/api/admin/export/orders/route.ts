import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const { supabase } = await requireAdmin();

  const { data: orders } = await supabase
    .from("orders")
    .select("order_number, created_at, customer_email, status, subtotal, shipping_cost, tax_amount, total")
    .order("created_at", { ascending: false });

  const header = [
    "Bestellnummer",
    "Datum",
    "E-Mail",
    "Status",
    "Zwischensumme",
    "Versand",
    "USt. (enthalten)",
    "Gesamt",
  ];

  const rows = (orders ?? []).map((o) =>
    [
      o.order_number,
      new Date(o.created_at).toISOString().slice(0, 10),
      o.customer_email,
      o.status,
      o.subtotal.toFixed(2),
      o.shipping_cost.toFixed(2),
      o.tax_amount.toFixed(2),
      o.total.toFixed(2),
    ]
      .map((v) => csvEscape(String(v)))
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="conceptly-bestellungen-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
