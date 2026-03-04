import React from "react";
import { Flex } from "@/components/ui/flex";
import { Button } from "@/components/ui/button";
import { HeaderWrapper } from "@/components/ui/header-wrapper/HeaderWrapper";
import { TitleHeader } from "@/components/ui/title-header/TitleHeader";
import type { GLAccountTypeFormProps } from "@/types/loan-product-and-scheme-masters/gl-account-types.types";
import { RefreshCw, Save, Plus, ChevronDown } from "lucide-react";
import { FormContainer } from "@/components/ui/form-container";
import { GLAccountTypesTable } from "../Table/GlAccountTypes";
import { useGLAccountTypesForm } from "../../hooks/useGlAccountTypesForm";

export const GLAccountTypesForm: React.FC<GLAccountTypeFormProps> = ({
  readonly = false,
}) => {
  const {
    isTableOpen,
    glAccountTypesData,
    isInitialState,

    isSaveEnabled,
    isProcessing,
    isLoadingTable,

    setIsTableOpen,
    handleUpdateGLAccount,
    handleToggleActive,
    handleReset,
    handleSave,
  } = useGLAccountTypesForm({ readonly });

  return (
    <article className="gl-account-types-form-container">
      <FormContainer>
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="GL Account Types for Loan Scheme Posting" />
          </HeaderWrapper>
          <Button
            variant="resetPrimary"
            size="compactWhite"
            onClick={() => setIsTableOpen(!isTableOpen)}
            disabled={readonly}
          >
            <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-white">
              <Plus className="text-primary h-3 w-3" />
            </div>
            Add GL Account Types
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${isTableOpen ? "rotate-180" : ""}`}
            />
          </Button>
        </Flex>

        {isTableOpen && (
          <div className="mb-2">
            <GLAccountTypesTable
              glAccountTypes={glAccountTypesData}
              onUpdateGLAccount={handleUpdateGLAccount}
              onToggleActive={handleToggleActive}
              isLoading={isLoadingTable}
              readonly={readonly}
            />

            <div className="mt-6">
              <Flex.ActionGroup>
                <Button
                  type="button"
                  variant="resetCompact"
                  size="compactWhite"
                  onClick={handleReset}
                  disabled={readonly || isProcessing}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="resetPrimary"
                  size="compactWhite"
                  onClick={handleSave}
                  disabled={readonly || isProcessing || !isSaveEnabled}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isProcessing
                    ? isInitialState
                      ? "Saving..."
                      : "Updating..."
                    : isInitialState
                      ? "Save GL Account Types"
                      : "Update GL Account Types"}
                </Button>
              </Flex.ActionGroup>
            </div>
          </div>
        )}
      </FormContainer>
    </article>
  );
};
