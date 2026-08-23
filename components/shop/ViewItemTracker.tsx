"use client";

import { useEffect } from "react";
import { trackShopEvent } from "@/lib/analytics/trackEvent";

export function ViewItemTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackShopEvent("view_item", productId);
  }, [productId]);
  return null;
}
