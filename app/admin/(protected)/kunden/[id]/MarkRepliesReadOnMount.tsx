"use client";

import { useEffect } from "react";
import { markCustomerRepliesRead } from "./actions";

export function MarkRepliesReadOnMount({ customerId }: { customerId: string }) {
  useEffect(() => {
    markCustomerRepliesRead(customerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
