import React, { useCallback, useState, useEffect } from "react";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { FormContainer } from "@/components/ui/form-container";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Filter } from "lucide-react";
import { logger } from "@/global/service";
import {
  useGetWorkflowsForAmountQuery,
  useSearchWorkflowAmountRulesQuery,
  useDeleteWorkflowAmountRuleMutation,
  useGetApprovalFlowsQuery,
  useGetAmountOnOptionsQuery,
} from "@/global/service/end-points/approval-workflow/workflow-amount";
import type { AmountRulesFilterProps } from "@/types/approval-workflow/workflow-amount.types";
import { WorkflowAmountTable } from "../Table/AmountRules";

export const AmountRulesFilter: React.FC<AmountRulesFilterProps> = ({
  onEdit,
  selectedWorkflow,
  onWorkflowChange,
}) => {
  const isInternalUpdate = React.useRef(false);
  const [queryWorkflow, setQueryWorkflow] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filterWorkflow, setFilterWorkflow] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: workflowOptions = [], isLoading: isLoadingWorkflows } =
    useGetWorkflowsForAmountQuery();
  const { data: approvalFlowOptions = [] } = useGetApprovalFlowsQuery();
  const { data: amountOnOptions = [] } = useGetAmountOnOptionsQuery();

  const {
    data: rulesResponse,
    isLoading: isLoadingRules,
    refetch: refetchRules,
  } = useSearchWorkflowAmountRulesQuery(
    {
      workflow: queryWorkflow,
      page: currentPage,
      size: 10,
    },
    {
      skip: false,
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteWorkflowAmountRule] = useDeleteWorkflowAmountRuleMutation();

  // Sync filter with form workflow selection
  useEffect(() => {
    if (selectedWorkflow && selectedWorkflow !== filterWorkflow) {
      isInternalUpdate.current = true;
      setFilterWorkflow(selectedWorkflow);
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 0);
    }
  }, [selectedWorkflow]);

  // Notify parent when filter workflow changes
  useEffect(() => {
    if (
      onWorkflowChange &&
      filterWorkflow &&
      filterWorkflow !== "all" &&
      !isInternalUpdate.current
    ) {
      onWorkflowChange(filterWorkflow);
    }
  }, [filterWorkflow, onWorkflowChange]);

  useEffect(() => {
    if (queryWorkflow !== undefined) {
      refetchRules();
    }
  }, [queryWorkflow, refetchRules]);

  const handleFilter = useCallback(() => {
    setCurrentPage(0);
    const workflowValue = filterWorkflow === "all" ? "" : filterWorkflow;

    setQueryWorkflow(workflowValue);
  }, [filterWorkflow]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDelete = useCallback(
    async (identity: string) => {
      const rule = rulesResponse?.content?.find(
        r => r.workflowAmountRuleIdentity === identity
      );

      setRuleToDelete({
        id: identity,
        name: rule?.workflowIdentity || "this rule",
      });
      setShowDeleteModal(true);
    },
    [rulesResponse]
  );

  const confirmDelete = useCallback(async () => {
    if (!ruleToDelete) return;

    try {
      await deleteWorkflowAmountRule(ruleToDelete.id).unwrap();
      logger.info("Workflow amount rule deleted successfully", {
        toast: true,
      });
      refetchRules();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message ||
            (error as { message?: string }).message ||
            "Failed to delete workflow amount rule"
          : "Failed to delete workflow amount rule";
      logger.error(errorMessage, { toast: true });
    } finally {
      setShowDeleteModal(false);
      setRuleToDelete(null);
    }
  }, [ruleToDelete, deleteWorkflowAmountRule, refetchRules]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setRuleToDelete(null);
  }, []);

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-6 w-full">
        <HeaderWrapper>
          <TitleHeader title="Saved Amount Rules" />
        </HeaderWrapper>
      </Flex>

      <div className="mb-4 rounded-lg bg-gray-50 p-4">
        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field label="Workflow">
              <Select
                value={filterWorkflow}
                onValueChange={setFilterWorkflow}
                placeholder="All"
                size="form"
                variant="form"
                fullWidth={true}
                itemVariant="form"
                options={[{ value: "all", label: "All" }, ...workflowOptions]}
                loading={isLoadingWorkflows}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <div className="pt-5">
              <Button
                type="button"
                variant="primary"
                size="compact"
                onClick={handleFilter}
                className="w-full"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </Form.Col>
        </Form.Row>
      </div>

      <WorkflowAmountTable
        rules={rulesResponse?.content || []}
        isLoading={isLoadingRules}
        currentPage={currentPage}
        totalPages={rulesResponse?.totalPages || 0}
        totalElements={rulesResponse?.totalElements || 0}
        onPageChange={handlePageChange}
        onEdit={onEdit}
        onDelete={handleDelete}
        workflowOptions={workflowOptions}
        approvalFlowOptions={approvalFlowOptions}
        amountOnOptions={amountOnOptions}
      />
      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Delete Amount Rule"
        message={
          "Are you sure you want to delete this amount rule? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="standard"
      />
    </FormContainer>
  );
};
