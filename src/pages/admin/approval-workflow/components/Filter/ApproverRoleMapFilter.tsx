import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Form } from "@/components";
import { FilterIcon } from "lucide-react";
import type {
  ApproverRoleMappingFilterBarProps,
  ApproverRoleMappingFilters,
} from "@/types/admin/approverrolemap";

export const ApproverRoleMappingFilterBar: React.FC<
  ApproverRoleMappingFilterBarProps
> = ({ selectedFilters, onFilterApply }) => {
  const [tempFilters, setTempFilters] =
    useState<ApproverRoleMappingFilters>(selectedFilters);

  const updateFilter = (
    key: keyof ApproverRoleMappingFilters,
    value: string
  ) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-lg border-b bg-gray-100 p-4 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.15)]">
      <Form.Row>
        <Form.Col lg={2}>
          <Form.Field label="Role Code">
            <Input
              value={tempFilters.roleCode}
              onChange={e => updateFilter("roleCode", e.target.value)}
              placeholder="Enter role code"
              size="form"
              variant="form"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2}>
          <Form.Field label="User Code">
            <Input
              value={tempFilters.userCode}
              onChange={e => updateFilter("userCode", e.target.value)}
              placeholder="Enter user code"
              size="form"
              variant="form"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2}>
          <Form.Field label="Branch Code">
            <Input
              value={tempFilters.branchCode}
              onChange={e => updateFilter("branchCode", e.target.value)}
              placeholder="Enter branch code"
              size="form"
              variant="form"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2}>
          <Form.Field label="Region Code">
            <Input
              value={tempFilters.regionCode}
              onChange={e => updateFilter("regionCode", e.target.value)}
              placeholder="Enter region code"
              size="form"
              variant="form"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2}>
          <Form.Field label="Cluster Code">
            <Input
              value={tempFilters.clusterCode}
              onChange={e => updateFilter("clusterCode", e.target.value)}
              placeholder="Enter cluster code"
              size="form"
              variant="form"
            />
          </Form.Field>
        </Form.Col>

        <Form.Col lg={2}>
          <Form.Field label="State Code">
            <Input
              value={tempFilters.stateCode}
              onChange={e => updateFilter("stateCode", e.target.value)}
              placeholder="Enter state code"
              size="form"
              variant="form"
            />
          </Form.Field>
        </Form.Col>
      </Form.Row>

      <div className="mt-4 flex justify-end">
        <Button
          size="xl"
          variant="primary"
          className="border-b border-gray-300 shadow-[0_3px_4px_-3px_rgba(0,0,0,0.25)]"
          onClick={() => onFilterApply(tempFilters)}
        >
          <FilterIcon className="mr-1 h-3 w-3" />
          Filter
        </Button>
      </div>
    </div>
  );
};
