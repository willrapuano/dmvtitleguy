"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X } from "lucide-react";

export default function AdminActions({
  userId,
  action,
}: {
  userId: string;
  action: "approve" | "revoke";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAction(approve: boolean) {
    setLoading(true);
    try {
      const res = await fetch("/api/agent-tools/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, approved: approve }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed");
      }
      router.refresh();
    } catch {
      alert("Request failed");
    } finally {
      setLoading(false);
    }
  }

  if (action === "approve") {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleAction(true)}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <Check className="h-4 w-4" />
          Approve
        </button>
        <button
          onClick={() => handleAction(false)}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
        >
          <X className="h-4 w-4" />
          Deny
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => handleAction(false)}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-red-100 hover:text-red-700 disabled:opacity-50 transition-colors"
    >
      Revoke
    </button>
  );
}
