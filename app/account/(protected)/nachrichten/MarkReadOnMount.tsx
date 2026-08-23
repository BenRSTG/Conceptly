"use client";

import { useEffect } from "react";
import { markAdminMessagesRead } from "./actions";

export function MarkReadOnMount() {
  useEffect(() => {
    markAdminMessagesRead();
  }, []);
  return null;
}
