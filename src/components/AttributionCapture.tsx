"use client";

import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/client-lead-attribution";

export function AttributionCapture() {
  useEffect(() => {
    captureFirstTouch();
  }, []);
  return null;
}

