"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureFirstTouch } from "@/lib/client-lead-attribution";

export function AttributionCapture() {
  const pathname = usePathname();
  useEffect(() => {
    captureFirstTouch();
  }, [pathname]);
  return null;
}
