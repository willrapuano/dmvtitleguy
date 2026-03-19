"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function UploadForm() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setFileName(file.name);
      setUploading(true);
      setError("");

      try {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/agent-tools/contract-analyzer/upload", {
          method: "POST",
          body: form,
        });

        const raw = await res.text();
        let data: { ok?: boolean; analysisId?: string; error?: string } = {};
        try {
          data = JSON.parse(raw);
        } catch {
          setError(`HTTP ${res.status}: ${raw.slice(0, 300)}`);
          setUploading(false);
          return;
        }

        if (!res.ok) {
          setError(`HTTP ${res.status}: ${data.error || "Upload failed"}`);
          setUploading(false);
          return;
        }

        router.push(`/agent-tools/contract-analyzer/analysis/${data.analysisId}`);
      } catch (e) {
        setError(`Client error: ${(e as Error).message}`);
        setUploading(false);
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
          isDragActive
            ? "border-brand-blue bg-blue-50"
            : uploading
            ? "border-gray-300 bg-gray-50"
            : "border-gray-300 bg-white hover:border-brand-blue hover:bg-blue-50/50"
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
            <p className="text-sm font-medium text-gray-700">
              Analyzing {fileName}...
            </p>
            <p className="text-xs text-gray-500">
              This may take 15-30 seconds
            </p>
          </div>
        ) : isDragActive ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-10 w-10 text-brand-blue" />
            <p className="text-sm font-medium text-brand-blue">Drop PDF here</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Drag & drop a contract PDF
              </p>
              <p className="text-xs text-gray-500">
                or click to browse — NVAR K1321 / GCAAR 1301 / MAR
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
