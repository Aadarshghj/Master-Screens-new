import React, { useState } from "react";
import { Button, Select } from "@/components/ui";
import { Form } from "@/components";
import { FilterIcon } from "lucide-react";
import type { StagesSetupFilterBarProps } from "@/types/admin/workflow-stages";

export const StagesSetupFilterBar: React.FC<StagesSetupFilterBarProps> = ({
  workflowOptions,
  selectedWorkflow,
  onFilterApply,
}) => {
  const [tempWorkflow, setTempWorkflow] = useState(selectedWorkflow);

  return (
    <div className="rounded-lg border-b bg-gray-100 p-4 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.15)]">
      <div className="flex items-center justify-between">
        <div className="max-w-50 flex-1">
          <Form.Field label="Workflow">
            <Select
              value={tempWorkflow}
              onValueChange={setTempWorkflow}
              placeholder="All"
              options={[{ label: "All", value: "All" }, ...workflowOptions]}
              size="form"
              variant="form"
              fullWidth
            />
          </Form.Field>
        </div>
        <div>
          <Button
            className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
            size="xl"
            variant="primary"
            onClick={() => onFilterApply(tempWorkflow)}
          >
            <FilterIcon className="h-3 w-3" />
            Filter
          </Button>
        </div>
      </div>
    </div>
  );
};
