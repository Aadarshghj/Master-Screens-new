import { cn } from "@/utils";
import { Button } from "@/components";

interface FooterProps {
  className?: string;
  onMenuToggle: () => void;
  menuButtonClassName?: string; // Changed from ref to className
  menuIcon?: string;
}

export function Footer({
  className,
  onMenuToggle,
  menuButtonClassName = "menu-trigger", // Default class name
  menuIcon = "/default-menu-icon.png",
}: FooterProps) {
  const getCurrentDateTime = () => {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return { time, date };
  };

  getCurrentDateTime();

  return (
    <footer
      className={cn(
        "bg-background fixed right-0 bottom-0 left-0 z-40 px-2 py-1",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="compact"
          onClick={() => onMenuToggle()}
          className={cn(
            "hover:bg-muted flex items-center rounded-md p-1 transition-colors",
            menuButtonClassName // Apply the CSS class here
          )}
          aria-label="Toggle menu"
          type="button"
        >
          <img
            src={menuIcon}
            alt="Menu Icon"
            className="h-6 w-6 object-contain"
          />
        </Button>

        {/* <div className="text-text-subtle text-xxs text-right leading-tight">
          <div className="font-mono">{time}</div>
          <div className="font-mono">{date}</div>
        </div> */}
      </div>
    </footer>
  );
}
