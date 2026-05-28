"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { upload } from "@vercel/blob/client";
import { Upload, FileText, CheckCircle } from "lucide-react";

interface TitleReviewFormProps {
  location?: string;
}

export function TitleReviewForm({ location = "request-title-review" }: TitleReviewFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploadError, setUploadError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyAddress: "",
    reviewType: "Full Title Search",
    urgency: "Standard",
    message: "",
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadError("");
    for (const file of acceptedFiles) {
      try {
        const blob = await upload(`funnels/title-review/${Date.now()}-${file.name}`, file, {
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
    },
    maxFiles: 3,
    disabled: status === "submitting",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/funnels/request-title-review", {
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
          Our title team will review your request and respond within one business day.
        </p>
        <p className="text-brand-muted text-sm">
          Need it faster? Call{" "}
          <a href="tel:+17038591467" className="text-brand-blue font-medium">(703) 859-1467</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-xl font-bold text-brand-navy mb-2">Request a Title Review</h3>
      <p className="text-brand-muted text-sm mb-6">Tell us about the property and what you need. We&apos;ll take it from here.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="tr-name" className="block text-sm font-medium text-brand-dark-text mb-1">Full Name *</label>
          <input id="tr-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Jane Smith" />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tr-email" className="block text-sm font-medium text-brand-dark-text mb-1">Email *</label>
            <input id="tr-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="jane@example.com" />
          </div>
          <div>
            <label htmlFor="tr-phone" className="block text-sm font-medium text-brand-dark-text mb-1">Phone *</label>
            <input id="tr-phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="(703) 555-0100" />
          </div>
        </div>

        {/* Property Address */}
        <div>
          <label htmlFor="tr-address" className="block text-sm font-medium text-brand-dark-text mb-1">Property Address *</label>
          <input id="tr-address" type="text" required value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="123 Main St, Arlington, VA 22201" />
        </div>

        {/* Review Type & Urgency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tr-type" className="block text-sm font-medium text-brand-dark-text mb-1">Review Type</label>
            <select id="tr-type" value={formData.reviewType} onChange={(e) => setFormData({ ...formData, reviewType: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white">
              <option value="Full Title Search">Full Title Search</option>
              <option value="Title Search Update">Title Search Update</option>
              <option value="Lien Search">Lien Search</option>
              <option value="Foreclosure Review">Foreclosure Review</option>
            </select>
          </div>
          <div>
            <label htmlFor="tr-urgency" className="block text-sm font-medium text-brand-dark-text mb-1">Urgency</label>
            <select id="tr-urgency" value={formData.urgency} onChange={(e) => setFormData({ ...formData, urgency: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white">
              <option value="Standard">Standard</option>
              <option value="Rush">Rush</option>
            </select>
          </div>
        </div>

        {/* Document Upload */}
        <div>
          <label className="block text-sm font-medium text-brand-dark-text mb-2">Upload Supporting Docs (optional)</label>
          <div {...getRootProps()} className={`flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${isDragActive ? "border-brand-blue bg-blue-50" : "border-gray-300 bg-white hover:border-brand-blue hover:bg-blue-50/50"}`}>
            <input {...getInputProps()} />
            <Upload className="h-6 w-6 text-gray-400 mb-1" />
            <p className="text-sm text-gray-600">Drag & drop supporting documents</p>
            <p className="text-xs text-gray-400 mt-1">PDF or images — up to 3 files</p>
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

        {/* Message */}
        <div>
          <label htmlFor="tr-message" className="block text-sm font-medium text-brand-dark-text mb-1">Message (optional)</label>
          <textarea id="tr-message" rows={3} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Tell us about the property or your concerns..." />
        </div>

        {/* Submit */}
        <button type="submit" disabled={status === "submitting"} className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-60">
          {status === "submitting" ? "Submitting…" : "Request Title Review →"}
        </button>

        {status === "error" && (
          <p className="text-red-600 text-sm text-center">Something went wrong. Please call us at (703) 859-1467.</p>
        )}
      </form>
    </div>
  );
}