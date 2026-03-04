import React from "react";

interface ChargeMasterTabsProps {
  activeTab:
    | "charge-details"
    | "calculation-logic"
    | "state-config"
    | "tax-config";
  onTabChange: (
    tab: "charge-details" | "calculation-logic" | "state-config" | "tax-config"
  ) => void;
}

export const ChargeMasterTabs: React.FC<ChargeMasterTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "charge-details", label: "Charge Details" },
    { id: "calculation-logic", label: "Calculation Logic" },
    { id: "state-config", label: "State-Specific Configuration" },
    { id: "tax-config", label: "Tax Configuration" },
  ] as const;

  return (
    <div>
      <div className="flex space-x-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-2 text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? "bg-cyan-600 text-white"
                  : "bg-cyan-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
