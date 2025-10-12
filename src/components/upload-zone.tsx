import { cn } from "@ras-sh/ui";
import { AlertCircle, Upload } from "lucide-react";
import posthog from "posthog-js";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

type UploadZoneProps = {
  onDrop: (files: File[]) => void;
  processing: boolean;
};

export function UploadZone({ onDrop, processing }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      setError(null);
      const file = files[0];
      if (file) {
        posthog.capture("image_uploaded", {
          project: "img-to-palette",
          file_type: file.type,
          file_size: file.size,
          upload_method: isDragActive ? "drag_drop" : "file_picker",
        });
      }
      onDrop(files);
    },
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (!rejection) {
        return;
      }

      const fileError = rejection.errors[0];
      if (!fileError) {
        return;
      }

      let errorMessage: string;
      switch (fileError.code) {
        case "file-too-small":
          errorMessage = "File is too small. Please upload a valid image.";
          break;
        case "file-invalid-type":
          errorMessage =
            "Invalid file type. Please upload a JPG, PNG, GIF, or WebP.";
          break;
        case "too-many-files":
          errorMessage = "Too many files. Please upload only one image.";
          break;
        default:
          errorMessage = "Failed to upload file. Please try again.";
      }

      setError(errorMessage);

      // Track upload rejection
      posthog.capture("upload_rejected", {
        project: "img-to-palette",
        error_code: fileError.code,
        error_message: errorMessage,
        file_size: rejection.file.size,
        file_type: rejection.file.type,
      });
    },
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    disabled: processing,
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative mx-auto cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors sm:p-24",
          isDragActive
            ? "border-zinc-100 bg-zinc-900/50"
            : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/30",
          processing ? "pointer-events-none opacity-50" : ""
        )}
      >
        <input {...getInputProps()} />

        <div className="space-y-6">
          <Upload className="mx-auto h-16 w-16 text-zinc-500" />
          <div>
            <h2 className="mb-2 font-bold text-2xl text-zinc-100">
              {processing
                ? "Extracting palette..."
                : isDragActive
                  ? "Drop image here"
                  : "Drop image here or click to select"}
            </h2>
            <p className="text-lg text-zinc-400">
              Extract beautiful color palettes from your image
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
