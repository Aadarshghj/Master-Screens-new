import toast, { Toaster, ToastBar } from "react-hot-toast";
import { Check, AlertCircle, Info } from "lucide-react";

export function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerClassName="mb-4 mr-4"
      toastOptions={{
        className:
          "flex items-center gap-4 min-h-16 min-w-96 max-w-lg shadow-xl text-sm relative rounded-xl  py-3",
        duration: 4000,
        success: {
          className: "bg-green-50 text-green-800 border-2 border-green-200",
        },
        error: {
          className: "bg-red-50 text-red-800 border-2 border-red-200",
        },
        loading: {
          className: "bg-blue-50 text-blue-800 border-2 border-blue-200",
        },
      }}
    >
      {t => (
        <ToastBar toast={t} style={{ ...t.style }}>
          {({ message }) => {
            const getIcon = () => {
              switch (t.type) {
                case "success":
                  return <Check className="text-success" />;
                case "error":
                  return <AlertCircle className="text-status-error" />;
                default:
                  return <Info className="text-primary" />;
              }
            };

            const getButtonStyle = () => {
              switch (t.type) {
                case "success":
                  return "text-success hover:text-success/80 focus:ring-success/40";
                case "error":
                  return "text-status-error hover:text-status-error/80 focus:ring-status-error/40";
                case "loading":
                  return "text-primary hover:text-primary/80 focus:ring-primary/40";
                default:
                  return "text-neutral hover:text-neutral/80 focus:ring-neutral/40";
              }
            };

            return (
              <div className="relative flex min-h-12 items-center gap-4 p-2 text-sm">
                {/* <img
                  src={logo}
                  alt="Indel Money"
                  width={80}
                  height={90}
                  className="shrink-0"
                /> */}

                <div className="flex-1">
                  <span className="text-sm font-semibold">{message}</span>
                </div>

                <button
                  onClick={() => toast.dismiss(t.id)}
                  className={`ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-gray-200 focus:ring-2 focus:outline-none ${getButtonStyle()}`}
                  aria-label="Close toast"
                >
                  {getIcon()}
                </button>
              </div>
            );
          }}
        </ToastBar>
      )}
    </Toaster>
  );
}
