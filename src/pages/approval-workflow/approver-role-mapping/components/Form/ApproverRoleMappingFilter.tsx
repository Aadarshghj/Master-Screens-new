import React from "react";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Filter, RefreshCw } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Button, Form, Input } from "@/components";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ApproverRoleMappingTable } from "../Table/ApproverRoleMapping";
import { useApproverRoleMappingTable } from "../../hooks/useApproverRoleMappingFilter";

export const ApproverRoleMappingFilterTable: React.FC = () => {
  const {
    filterForm,
    searchResults,
    isSearched,
    isSearching,
    currentPage,
    showDeleteModal,
    mappingToDelete,
    deletingMappingId,
    handleSearch,
    handleResetFilter,
    handlePageChange,
    handleEdit,
    handleDelete,
    confirmDeleteMapping,
    cancelDeleteMapping,
  } = useApproverRoleMappingTable();

  const { register } = filterForm;

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-2 w-full">
        <HeaderWrapper>
          <TitleHeader title="Saved Mappings" />
        </HeaderWrapper>
      </Flex>

      {/* Filter Section */}
      <div className="mb-1 rounded-lg bg-gray-50 p-4">
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Role Code">
              <Input
                {...register("roleCode")}
                placeholder="Enter role code"
                size="form"
                variant="form"
                disabled={isSearching}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="User Code">
              <Input
                {...register("userCode")}
                placeholder="Enter user code"
                size="form"
                variant="form"
                disabled={isSearching}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Branch Code">
              <Input
                {...register("branchCode")}
                placeholder="Enter branch code"
                size="form"
                variant="form"
                disabled={isSearching}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Region Code">
              <Input
                {...register("regionCode")}
                placeholder="Enter region code"
                size="form"
                variant="form"
                disabled={isSearching}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Cluster Code">
              <Input
                {...register("clusterCode")}
                placeholder="Enter cluster code"
                size="form"
                variant="form"
                disabled={isSearching}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="State Code">
              <Input
                {...register("stateCode")}
                placeholder="Enter state code"
                size="form"
                variant="form"
                disabled={isSearching}
              />
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <Form.Row className="mt-4">
          <Form.Col lg={12} md={12} span={12}>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="resetCompact"
                size="compactWhite"
                onClick={handleResetFilter}
                disabled={isSearching}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                type="button"
                variant="resetPrimary"
                size="compactWhite"
                onClick={handleSearch}
                disabled={isSearching}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </Form.Col>
        </Form.Row>
      </div>

      {/* Table Section */}
      <ApproverRoleMappingTable
        mappings={searchResults.content || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isSearching}
        isSearched={isSearched}
        currentPage={currentPage}
        totalPages={searchResults.totalPages || 0}
        totalElements={searchResults.totalElements || 0}
        onPageChange={handlePageChange}
        deletingMappingId={deletingMappingId}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteMapping}
        onCancel={cancelDeleteMapping}
        title="Delete Approver Role Mapping"
        message={`Are you sure you want to delete the mapping "${mappingToDelete?.name}"? This action cannot be undone.`}
        confirmText={
          deletingMappingId === mappingToDelete?.id ? "Deleting..." : "Delete"
        }
        cancelText="Cancel"
        type="error"
        size="standard"
      />
    </FormContainer>
  );
};
