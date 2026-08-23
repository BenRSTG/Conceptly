import "server-only";
import { getResendClient, RESEND_FROM_EMAIL } from "@/lib/resend";
import { formatPrice } from "@/lib/utils";
import type { OrderRow, OrderItemRow } from "@/lib/types/database";

export async function sendOrderConfirmationEmail(order: OrderRow, items: OrderItemRow[]) {
  const rows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:4px 8px;">${item.product_title_snapshot}</td>
          <td style="padding:4px 8px;">${item.quantity}×</td>
          <td style="padding:4px 8px;">${formatPrice(item.unit_price)}</td>
        </tr>`,
    )
    .join("");

  await getResendClient().emails.send({
    from: RESEND_FROM_EMAIL,
    to: order.customer_email,
    subject: `Deine Bestellung bei Conceptly (${order.order_number})`,
    html: `
      <p>Hallo,</p>
      <p>danke für deine Bestellung bei Conceptly! Wir bereiten sie gerade vor.</p>
      <p><strong>Bestellnummer:</strong> ${order.order_number}</p>
      <table style="border-collapse:collapse;width:100%;max-width:480px;">
        ${rows}
      </table>
      <p>
        Zwischensumme: ${formatPrice(order.subtotal)}<br />
        Versand: ${formatPrice(order.shipping_cost)}<br />
        <strong>Gesamt: ${formatPrice(order.total)}</strong>
      </p>
      <p>Wir melden uns, sobald deine Bestellung versendet wurde.</p>
    `,
  });
}
