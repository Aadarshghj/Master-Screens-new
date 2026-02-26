import React from "react";

interface StateZoneSelectorProps {
  zoneName: string;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
}

export const StateZoneSelector: React.FC<StateZoneSelectorProps> = ({
  zoneName,
  isSelected,
  onToggle,
  disabled = false,
}) => {
  return (
    <div
      className={`
        rounded-lg border p-3 transition-all
        ${
          isSelected
            ? " bg-blue-100"
            : "hover:border-primary/30 border-gray-200 bg-white"
        }
        ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
      `}
      onClick={() => !disabled && onToggle(!isSelected)}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
          flex h-5 w-5 items-center justify-center rounded border transition-all
          ${
            isSelected
              ? "border-primary bg-primary"
              : "border-gray-300 bg-white"
          }
        `}
        >
          {isSelected && (
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </div>
        <span className="text-sm font-medium">{zoneName}</span>
      </div>
    </div>
  );
};
