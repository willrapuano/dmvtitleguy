import { requireAdmin } from "@/lib/contract-analyzer/auth";
import { prisma } from "@/lib/prisma";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import AdminActions from "@/components/contract-analyzer/AdminActions";

export const metadata: Metadata = {
  title: "Admin | Agent Tools | DMV Title Guy",
};

export default async function AdminPage() {
  const admin = await requireAdmin();

  const users = await prisma.toolUser.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { analyses: true } },
    },
  });

  const pending = users.filter((u) => !u.approved);
  const approved = users.filter((u) => u.approved);

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container-xl max-w-3xl">
        <Link
          href="/agent-tools"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Agent Tools
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-xl bg-brand-navy/5 p-2.5">
            <Shield className="h-6 w-6 text-brand-navy" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Admin Panel</h1>
            <p className="text-sm text-gray-500">
              Manage user access · Signed in as {admin.email}
            </p>
          </div>
        </div>

        {/* Pending Approvals */}
        <h2 className="text-lg font-semibold text-brand-navy mb-3">
          Pending Approval ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500 mb-8">
            No pending requests
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {pending.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{u.email}</p>
                  <p className="text-xs text-gray-500">
                    Registered {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <AdminActions userId={u.id} action="approve" />
              </div>
            ))}
          </div>
        )}

        {/* Approved Users */}
        <h2 className="text-lg font-semibold text-brand-navy mb-3">
          Approved Users ({approved.length})
        </h2>
        <div className="space-y-3">
          {approved.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{u.email}</p>
                  {u.isAdmin && (
                    <span className="rounded-full bg-brand-navy/10 px-2 py-0.5 text-xs font-medium text-brand-navy">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {u._count.analyses} analyses ·{" "}
                  Joined {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!u.isAdmin && <AdminActions userId={u.id} action="revoke" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
