import React, { useState, useMemo } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CalculationLogicTable } from "../Table/CalculationLogicTable";
import { Flex, HeaderWrapper, TitleHeader } from "@/components";
import type { ChargeMasterFormData } from "@/types/loan-product-and-scheme-masters/charge-master.types";

export const CalculationLogicForm: React.FC = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<ChargeMasterFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "calculationLogic.calculationLogics",
  });

  const [tempLogic, setTempLogic] = useState({
    upToAmount: "",
    chargeAmountPercentage: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    upToAmount: "",
    chargeAmountPercentage: "",
  });

  const calculationLogics = watch("calculationLogic.calculationLogics") || [];

  const isDuplicateAmount = useMemo(() => {
    if (!tempLogic.upToAmount.trim()) return false;

    const newAmountValue = parseFloat(tempLogic.upToAmount);
    if (isNaN(newAmountValue)) return false;

    return calculationLogics.some(logic => {
      const existingAmount = parseFloat(logic.upToAmount);
      return existingAmount === newAmountValue;
    });
  }, [tempLogic.upToAmount, calculationLogics]);

  const handleAdd = () => {
    setFieldErrors({
      upToAmount: "",
      chargeAmountPercentage: "",
    });

    const errors = {
      upToAmount: "",
      chargeAmountPercentage: "",
    };

    if (!tempLogic.upToAmount || tempLogic.upToAmount.trim() === "") {
      errors.upToAmount = "Up To Amount is required";
    } else {
      const upToAmountValue = parseFloat(tempLogic.upToAmount);

      if (isNaN(upToAmountValue) || upToAmountValue <= 0) {
        errors.upToAmount = "Up To Amount must be a valid positive number";
      } else if (isDuplicateAmount) {
        errors.upToAmount = `Up To Amount ${tempLogic.upToAmount} already exists`;
      }
    }

    if (
      !tempLogic.chargeAmountPercentage ||
      tempLogic.chargeAmountPercentage.trim() === ""
    ) {
      errors.chargeAmountPercentage = "Charge Amount/Percentage is required";
    } else {
      const chargeValue = parseFloat(
        tempLogic.chargeAmountPercentage.replace("%", "").trim()
      );

      if (isNaN(chargeValue)) {
        errors.chargeAmountPercentage = "Must be a valid number";
      }
    }

    if (errors.upToAmount || errors.chargeAmountPercentage) {
      setFieldErrors(errors);
      return;
    }

    append({
      id: fields.length + 1,
      upToAmount: tempLogic.upToAmount,
      chargeAmountPercentage: tempLogic.chargeAmountPercentage,
    });

    setTempLogic({ upToAmount: "", chargeAmountPercentage: "" });
  };

  const handleDelete = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-cyan-600 bg-white p-6">
        <Flex justify="between" align="center" className="mb-6 w-full">
          <HeaderWrapper>
            <TitleHeader title="Charge Calculation Logic" />
          </HeaderWrapper>
        </Flex>

        <Form.Row>
          <Form.Col lg={3} md={6} span={12}>
            <Form.Field
              label="Up To Amount"
              required
              error={
                fieldErrors.upToAmount || isDuplicateAmount
                  ? {
                      message:
                        fieldErrors.upToAmount || "This amount already exists",
                      type: "manual",
                    }
                  : undefined
              }
            >
              <Input
                value={tempLogic.upToAmount}
                onChange={e => {
                  setTempLogic({ ...tempLogic, upToAmount: e.target.value });
                  if (fieldErrors.upToAmount) {
                    setFieldErrors({ ...fieldErrors, upToAmount: "" });
                  }
                }}
                placeholder="Enter Up To Amount"
                size="form"
                variant="form"
                type="number"
                min="0"
                step="0.01"
                className={
                  isDuplicateAmount && !fieldErrors.upToAmount
                    ? "border-red-500"
                    : ""
                }
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={3} md={6} span={12}>
            <Form.Field
              label="Charge Amount/Percentage"
              required
              error={
                fieldErrors.chargeAmountPercentage
                  ? {
                      message: fieldErrors.chargeAmountPercentage,
                      type: "manual",
                    }
                  : undefined
              }
            >
              <Input
                value={tempLogic.chargeAmountPercentage}
                onChange={e => {
                  setTempLogic({
                    ...tempLogic,
                    chargeAmountPercentage: e.target.value,
                  });
                  if (fieldErrors.chargeAmountPercentage) {
                    setFieldErrors({
                      ...fieldErrors,
                      chargeAmountPercentage: "",
                    });
                  }
                }}
                placeholder="Enter Charge Amount/Percentage"
                size="form"
                variant="form"
                type="number"
                min="0"
                step="0.01"
              />
            </Form.Field>
          </Form.Col>

          <Form.Col lg={1} md={6} span={12}>
            <div className="pt-4">
              <Button
                type="button"
                variant="resetPrimary"
                size="compactWhite"
                className="w-full"
                onClick={handleAdd}
                disabled={isDuplicateAmount}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </Form.Col>
        </Form.Row>

        {errors.calculationLogic?.calculationLogics && (
          <p className="mt-2 text-xs text-red-600">
            {errors.calculationLogic.calculationLogics.message}
          </p>
        )}

        <div className="mt-6">
          <Flex justify="between" align="center" className="mb-6 w-full">
            <HeaderWrapper>
              <TitleHeader title="Charge Calculation Details" />
            </HeaderWrapper>
          </Flex>

          <CalculationLogicTable
            calculationLogics={calculationLogics}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};
