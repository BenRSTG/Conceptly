"use client";

import { useEffect } from "react";
import { captureUtmFromLocation } from "@/lib/analytics/session";

export function UtmCapture() {
  useEffect(() => {
    captureUtmFromLocation();
  }, []);
  return null;
}
