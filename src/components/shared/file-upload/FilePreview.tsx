import React from "react";
import { Eye, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  file: File;
  base64Data: string;
  className?: string;
  onView?: () => void;
  onDownload?: () => void;
  title?: string;
  status?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  base64Data,
  className = "",
  onView,
  onDownload,
  title = "Processed File",
  status = "Ready",
}) => {
  const dataUrl = `data:${file.type};base64,${base64Data}`;

  const handleView = () => {
    if (onView) {
      onView();
      return;
    }

    const newWindow = window.open();
    if (!newWindow) return;

    if (file.type === "application/pdf") {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>PDF Viewer</title></head>
          <body style="margin:0;padding:0;">
            <iframe src="${dataUrl}" width="100%" height="100%" style="border:none;"></iframe>
          </body>
        </html>
      `);
    } else {
      newWindow.location.href = dataUrl;
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }

    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: file.type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Silently ignore download errors
    }
  };

  const renderPreview = () => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="flex justify-center p-3">
          <img
            src={dataUrl}
            alt="File preview"
            className="max-h-64 max-w-full rounded object-contain shadow"
          />
        </div>
      );
    }

    if (file.type === "application/pdf") {
      return (
        <div className="p-3">
          <iframe
            src={dataUrl}
            width="100%"
            height="400px"
            className="border-border rounded border"
            title="PDF Preview"
          />
        </div>
      );
    }

    return (
      <div className="bg-muted p-6 text-center">
        <FileText className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
        <p className="text-foreground text-sm font-medium">
          Preview not available
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          File type: {file.type.split("/")[1].toUpperCase()}
        </p>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-card border-border overflow-hidden rounded-lg border shadow">
        <div className="border-border flex items-center justify-between border-b p-4">
          <div className="flex items-center">
            <FileText className="text-theme-primary mr-2 h-5 w-5" />
            <h3 className="text-card-foreground text-base font-medium">
              {title}
            </h3>
            {status && (
              <span className="bg-status-success-background text-status-success-foreground ml-2 rounded px-2 py-0.5 text-xs">
                {status}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            <Button variant="default" onClick={handleView}>
              <Eye className="mr-1 h-3 w-3" />
              View
            </Button>
            <Button variant="primary" onClick={handleDownload}>
              <Download className="mr-1 h-3 w-3" />
              Download
            </Button>
          </div>
        </div>

        <div className="bg-card">{renderPreview()}</div>

        <div className="border-border bg-muted border-t p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-foreground font-medium">File Info:</span>
            <div className="text-muted-foreground space-x-3 truncate">
              <span className="max-w-32 truncate">{file.name}</span>
              <span>{file.type.split("/")[1].toUpperCase()}</span>
              <span>{Math.round(file.size / 1024)} KB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
