import React from "react";
import { X } from "lucide-react";

interface FileViewerProps {
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  title?: string;
}

const FileViewer: React.FC<FileViewerProps> = ({
  isOpen = true,
  onClose,
  children,
  title = "File Viewer",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex h-[90vh] w-[95vw] max-w-6xl flex-col rounded-lg bg-white shadow-2xl">
        {/* Compact Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h2 className="text-lg font-medium text-gray-700">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-red-100"
          >
            <X className="h-5 w-5 text-red-500" strokeWidth={2.5} />
          </button>
        </header>

        {/* File Content Area */}
        <main className="flex-1 overflow-auto p-4">
          <div className="h-full rounded-lg border border-gray-200 bg-white">
            {children || (
              <div className="flex h-full items-center justify-center text-gray-400">
                <p>File content will be displayed here</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FileViewer;
export { FileViewer };
