import React from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@/components/ui/flex";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import { Filter } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { Form, Select } from "@/components";
// import { AssetItemAttributesTable } from "../Table/AssetItemAttributeTable";
// import { ASSET_ITEM_DEFAULT_VALUES } from "../../constants/form.constants";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useAssetItemAttributesFilter } from "../../hooks/useAssetItemAttributeFilter";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

export const AssetItemAttributesFilter: React.FC = () => {
  const {
    // searchResults,
    showDeleteModal,
    attributeToDelete,
    filterControl,
    // handleSearch,
  //  handleResetFilters,
  // handleDelete,
    confirmDeleteAttribute,
    cancelDeleteAttribute,
  } = useAssetItemAttributesFilter([]);

  return (
    <FormContainer>
      <Flex justify="between" align="center" className="mb-4 w-full pt-7 px-4">
        <HeaderWrapper>
          <TitleHeader title="Asset Item Attributes" />
        </HeaderWrapper>
      </Flex>

      <div className="mb-7 rounded-lg bg-gray-50 p-4">
        <Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Product">
              <Controller
                name="assetItem"
                control={filterControl}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || "all"}
                    onValueChange={val =>
                      field.onChange(val === "all" ? "" : val)
                    }
                    placeholder="All"
                    size="form"
                    variant="form"
                    fullWidth
                    itemVariant="form"
                    options={[
                      { value: "all", label: "All" },
                      { value: "Gold Loan", label: "Gold Loan" },
                    ]}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Attribute Name">
              <Controller
                name="attributeName"
                control={filterControl}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || "all"}
                    onValueChange={field.onChange}
                    placeholder="Enter Attribute Name"
                    size="form"
                    variant="form"
                    fullWidth
                    itemVariant="form"
                    options={[
                      { value: "all", label: "All" },
                      { value: "LTV Percentage", label: "LTV Percentage" },
                      { value: "EPI Repayment Type", label: "EPI Repayment Type" },
                      { value:"EPI Frequency", label:"EPI Frequency"}
                    ]}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={2} md={6} span={12}>
            <Form.Field label="Status">
              <Controller
                name="status"
                control={filterControl}
                render={({ field }) => (
                  <Select
                    value={
                      field.value === undefined
                        ? "all"
                        : field.value
                          ? "true"
                          : "false"
                    }
                    onValueChange={val => {
                      if (val === "all") field.onChange(undefined);
                      else field.onChange(val === "true");
                    }}
                    placeholder="All"
                    size="form"
                    variant="form"
                    fullWidth
                    itemVariant="form"
                    options={[
                      { value: "all", label: "All" },
                      { value: "true", label: "Active" },
                      { value: "false", label: "Inactive" },
                    ]}
                  />
                )}
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <div className="flex gap-2 pt-4">
              <NeumorphicButton type="submit" variant="default" size="default">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </NeumorphicButton>
            </div>
          </Form.Col>
        </Form.Row>
      </div>

      {/* Table */}
      {/* <AssetItemAttributeTable
      // attributes={searchResults.content}
      //  onDelete={handleDelete}
      /> */}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={confirmDeleteAttribute}
        onCancel={cancelDeleteAttribute}
        title="Delete Asset Item Attribute"
        message={`Are you sure you want to delete the attribute "${attributeToDelete?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="error"
        size="standard"
      />
    </FormContainer>
  );
};
