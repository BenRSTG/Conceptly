"use client";

import { createClient } from "@/lib/supabase/client";
import { getOrCreateSessionId, getStoredUtm } from "./session";
import type { ShopEventType } from "@/lib/types/database";

export function trackShopEvent(
  eventType: ShopEventType,
  productId: string | null,
  metadata: Record<string, unknown> = {},
) {
  const supabase = createClient();
  const sessionId = getOrCreateSessionId();
  const utm = getStoredUtm();

  // Fire-and-forget: Tracking darf den Nutzerfluss nie blockieren oder stören.
  supabase
    .from("shop_events")
    .insert({
      event_type: eventType,
      product_id: productId,
      session_id: sessionId,
      metadata: { ...utm, ...metadata },
    })
    .then(
      () => {},
      () => {},
    );
}
