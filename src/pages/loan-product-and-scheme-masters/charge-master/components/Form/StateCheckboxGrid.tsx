import React from "react";
import type { StateZoneConfig } from "@/types/loan-product-and-scheme-masters/charge-master.types";

interface StateCheckboxGridProps {
  states: StateZoneConfig[];
  selectedStates: Set<string>;
  onStateToggle: (identity: string, checked: boolean) => void;
  disabled?: boolean;
}

export const StateCheckboxGrid: React.FC<StateCheckboxGridProps> = ({
  states,
  selectedStates,
  onStateToggle,
  disabled = false,
}) => {
  return (
    <>
      {states.map(state => {
        const isSelected = selectedStates.has(state.identity);
        return (
          <div
            key={state.identity}
            className={`
              rounded-lg border p-3 transition-all
              ${
                isSelected
                  ? "border-primary bg-blue-100"
                  : "hover:border-primary/30 border-gray-200 bg-white"
              }
              ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
            `}
            onClick={() =>
              !disabled && onStateToggle(state.identity, !isSelected)
            }
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
              <div className="flex flex-col">
                <span className="text-sm font-medium">{state.stateName}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
