"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { upload } from "@vercel/blob/client";
import { Upload, FileText, CheckCircle } from "lucide-react";

interface UploadContractFormProps {
  location?: string;
}

export function UploadContractForm({ location = "upload-contract" }: UploadContractFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    transactionType: "Purchase",
    closingTimeline: "",
    notes: "",
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploadError("");
    try {
      const blob = await upload(`funnels/upload-contract/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/funnels/upload-url",
      });
      setUploadedFile({ name: file.name, url: blob.url });
    } catch (e) {
      setUploadError(`Upload failed: ${(e as Error).message}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: status === "submitting",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) {
      setUploadError("Please upload a ratified contract PDF.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/funnels/upload-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          contractUrl: uploadedFile.url,
          contractName: uploadedFile.name,
          location,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="t-h5 text-brand-navy mb-2">Contract Received!</h3>
        <p className="text-brand-muted text-sm mb-4">
          We&apos;ll initiate the title process within 1 business hour.
        </p>
        <p className="text-brand-muted text-sm">
          Questions? Call{" "}
          <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contract Upload - PROMINENT */}
      <div>
        <label className="block text-sm font-medium text-brand-dark-text mb-2">Upload Ratified Contract (PDF) *</label>
        <div {...getRootProps()} className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${isDragActive ? "border-brand-blue bg-blue-50" : uploadedFile ? "border-green-400 bg-green-50/50" : "border-gray-300 bg-white hover:border-brand-blue hover:bg-blue-50/50"}`}>
          <input {...getInputProps()} />
          {uploadedFile ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-sm font-medium text-gray-700">{uploadedFile.name}</p>
              <p className="text-xs text-gray-500">Click or drop to replace</p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center gap-3">
              <FileText className="h-10 w-10 text-brand-blue" />
              <p className="text-sm font-medium text-brand-blue">Drop your PDF here</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-10 w-10 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Drag & drop your ratified contract</p>
                <p className="text-xs text-gray-500">or click to browse — PDF only, up to 50MB</p>
              </div>
            </div>
          )}
        </div>
        {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="uc-name" className="block text-sm font-medium text-brand-dark-text mb-1">Full Name *</label>
          <input id="uc-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Jane Smith" />
        </div>
        <div>
          <label htmlFor="uc-email" className="block text-sm font-medium text-brand-dark-text mb-1">Email *</label>
          <input id="uc-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="jane@example.com" />
        </div>
        <div>
          <label htmlFor="uc-phone" className="block text-sm font-medium text-brand-dark-text mb-1">Phone *</label>
          <input id="uc-phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="(703) 555-0100" />
        </div>
      </div>

      {/* Transaction Type & Timeline */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="uc-type" className="block text-sm font-medium text-brand-dark-text mb-1">Transaction Type</label>
          <select id="uc-type" value={formData.transactionType} onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white">
            <option value="Purchase">Purchase</option>
            <option value="Refinance">Refinance</option>
            <option value="Investor">Investor</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="uc-timeline" className="block text-sm font-medium text-brand-dark-text mb-1">Closing Timeline</label>
          <input id="uc-timeline" type="text" value={formData.closingTimeline} onChange={(e) => setFormData({ ...formData, closingTimeline: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="e.g., March 15, 2026" />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="uc-notes" className="block text-sm font-medium text-brand-dark-text mb-1">Additional Notes (optional)</label>
        <textarea id="uc-notes" rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Anything we should know about this transaction..." />
      </div>

      {/* Submit */}
      <button type="submit" disabled={status === "submitting" || !uploadedFile} className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60">
        {status === "submitting" ? "Submitting…" : "Submit Contract →"}
      </button>

      {status === "error" && (
        <p className="text-red-600 text-sm text-center">Something went wrong. Please call us at (703) 859-1467.</p>
      )}
    </form>
  );
}