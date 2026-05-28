"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { upload } from "@vercel/blob/client";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";

interface InvestorDueDiligenceFormProps {
  location?: string;
}

export function InvestorDueDiligenceForm({ location = "investor-due-diligence" }: InvestorDueDiligenceFormProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "submitting" | "success" | "error">("idle");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    buyerType: "LLC",
    source: "MLS",
    timeframe: "Standard (5-7 days)",
    notes: "",
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadError("");
    for (const file of acceptedFiles) {
      try {
        const blob = await upload(`funnels/investor-due-diligence/${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/funnels/upload-url",
        });
        setUploadedFiles((prev) => [...prev, { name: file.name, url: blob.url }]);
      } catch (e) {
        setUploadError(`Upload failed for ${file.name}: ${(e as Error).message}`);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 5,
    disabled: status === "submitting" || status === "uploading",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/funnels/investor-due-diligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          documents: uploadedFiles.map((f) => f.url),
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
        <h3 className="text-xl font-bold text-brand-navy mb-2">Request Submitted!</h3>
        <p className="text-brand-muted text-sm mb-4">
          Our team will review your submission and respond within one business day.
        </p>
        <p className="text-brand-muted text-sm">
          For immediate assistance, call{" "}
          <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-brand-navy mb-2">Start Your Due Diligence</h3>
      <p className="text-brand-muted text-sm mb-6">Fill out the form below and we&apos;ll begin your title search immediately.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="idd-name" className="block text-sm font-medium text-brand-dark-text mb-1">Full Name *</label>
          <input id="idd-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Jane Smith" />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="idd-email" className="block text-sm font-medium text-brand-dark-text mb-1">Email *</label>
            <input id="idd-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="jane@example.com" />
          </div>
          <div>
            <label htmlFor="idd-phone" className="block text-sm font-medium text-brand-dark-text mb-1">Phone *</label>
            <input id="idd-phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="(703) 555-0100" />
          </div>
        </div>

        {/* Property Address */}
        <div>
          <label htmlFor="idd-address" className="block text-sm font-medium text-brand-dark-text mb-1">Property Address *</label>
          <input id="idd-address" type="text" required value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="123 Main St, Arlington, VA 22201" />
        </div>

        {/* Buyer Type */}
        <div>
          <label className="block text-sm font-medium text-brand-dark-text mb-2">Buyer Type *</label>
          <div className="grid grid-cols-4 gap-2">
            {["LLC", "Individual", "Trust", "Other"].map((type) => (
              <label key={type} className={`flex items-center justify-center rounded border px-3 py-2 text-sm cursor-pointer transition-colors ${formData.buyerType === type ? "border-brand-blue bg-blue-50 text-brand-blue font-medium" : "border-gray-300 text-gray-600 hover:border-brand-blue"}`}>
                <input type="radio" name="buyerType" value={type} checked={formData.buyerType === type} onChange={(e) => setFormData({ ...formData, buyerType: e.target.value })} className="sr-only" />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Source & Timeframe */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="idd-source" className="block text-sm font-medium text-brand-dark-text mb-1">Source</label>
            <select id="idd-source" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white">
              <option value="Auction">Auction</option>
              <option value="MLS">MLS</option>
              <option value="Off-market">Off-market</option>
              <option value="Wholesaler">Wholesaler</option>
            </select>
          </div>
          <div>
            <label htmlFor="idd-timeframe" className="block text-sm font-medium text-brand-dark-text mb-1">Timeframe</label>
            <select id="idd-timeframe" value={formData.timeframe} onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white">
              <option value="Rush (1-3 days)">Rush (1-3 days)</option>
              <option value="Standard (5-7 days)">Standard (5-7 days)</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>

        {/* Document Upload */}
        <div>
          <label className="block text-sm font-medium text-brand-dark-text mb-2">Upload Documents (optional)</label>
          <div {...getRootProps()} className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${isDragActive ? "border-brand-blue bg-blue-50" : "border-gray-300 bg-white hover:border-brand-blue hover:bg-blue-50/50"}`}>
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Drag & drop contracts, deeds, or prior title policies</p>
            <p className="text-xs text-gray-400 mt-1">PDF, Word, or images — up to 5 files</p>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-2 space-y-1">
              {uploadedFiles.map((f) => (
                <div key={f.url} className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4 text-brand-blue" />
                  <span>{f.name}</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          )}
          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="idd-notes" className="block text-sm font-medium text-brand-dark-text mb-1">Notes / Comments (optional)</label>
          <textarea id="idd-notes" rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Any additional details about the property or transaction..." />
        </div>

        {/* Submit */}
        <button type="submit" disabled={status === "submitting"} className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60">
          {status === "submitting" ? "Submitting…" : "Start Your Due Diligence →"}
        </button>

        {status === "error" && (
          <p className="text-red-600 text-sm text-center">Something went wrong. Please call us at (703) 859-1467.</p>
        )}
      </form>
    </div>
  );
}