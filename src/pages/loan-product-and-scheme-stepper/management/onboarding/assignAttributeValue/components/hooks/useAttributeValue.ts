import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/hooks/store";
import { logger } from "@/global/service";
import {
  useGetLoanSchemeAttributeValuesQuery,
  useCreateLoanSchemeAttributeValuesMutation,
  useUpdateLoanSchemeAttributeValuesMutation,
} from "@/global/service/end-points/loan-product-and-scheme/loan-attribute-value";
import type {
  AssignAttributeFormData,
  AttributeValue,
  AttributeValueFormApiItem,
  AttributeValuesFormResponse,
} from "@/types/loan-product-and schema Stepper";
import { assignAttributeDefaultFormValues } from "../../constants/form.constants";
import {
  assignAttributeValidationSchema,
  validateTableData,
} from "@/global/validation/loan-product-and-scheme/loanAttributeValue";

export const useAttributeValue = () => {
  const { currentSchemeId } = useAppSelector(state => state.loanProduct);
  const [tableData, setTableData] = useState<AttributeValue[]>([]);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 30;

  const { data: attributeValuesData, refetch: refetchAttributeValues } =
    useGetLoanSchemeAttributeValuesQuery(currentSchemeId || "", {
      skip: !currentSchemeId,
    });

  const [createAttributeValues] = useCreateLoanSchemeAttributeValuesMutation();
  const [updateAttributeValues] = useUpdateLoanSchemeAttributeValuesMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
  } = useForm<AssignAttributeFormData>({
    defaultValues: assignAttributeDefaultFormValues,
    resolver: yupResolver(assignAttributeValidationSchema),
    mode: "onChange",
  });

  const formatAttributeDataForForm = (apiData: unknown) => {
    const responseData =
      (apiData as { data?: AttributeValuesFormResponse })?.data || apiData;
    const typedResponse = responseData as AttributeValuesFormResponse;
    return {
      loanProductName: typedResponse?.productName || "",
      loanSchemeName: typedResponse?.schemeName || "",
    };
  };

  useEffect(() => {
    if (attributeValuesData) {
      const formattedData = formatAttributeDataForForm(attributeValuesData);
      reset({ ...assignAttributeDefaultFormValues, ...formattedData });
    }
  }, [attributeValuesData, reset]);

  useEffect(() => {
    const responseData = attributeValuesData?.data || attributeValuesData;
    const typedResponse = responseData as AttributeValuesFormResponse;

    if (typedResponse?.attributeValues) {
      const { schemeName, attributeValues } = typedResponse;

      const mappedData: AttributeValue[] = attributeValues.map(
        (item: AttributeValueFormApiItem) => {
          const itemWithListValues = item as AttributeValueFormApiItem & {
            listValues?: string;
          };
          const listValues = itemWithListValues.listValues
            ? String(itemWithListValues.listValues)
                .split(",")
                .map(v => v.trim())
            : undefined;
          const mappedItem = {
            schemeIdentity: currentSchemeId || "",
            schemeName: schemeName || "",
            attributeName: item.attributeName || "",
            defaultValue: item.defaultValue || "",
            attributeValue:
              item.attributeValue && item.attributeValue !== null
                ? item.attributeValue
                : String(item.defaultValue || ""),
            status: item.isActive ?? false,
            listValues,
          };
          return mappedItem;
        }
      );

      setTableData(mappedData);
      const hasExistingData = attributeValues.some(
        (item: AttributeValueFormApiItem) => item.identity
      );
      setHasBeenSaved(hasExistingData);
      setTouchedFields(new Set());
    }
  }, [attributeValuesData, currentSchemeId]);

  const getInputType = (defaultValue: unknown) => {
    if (typeof defaultValue === "number" || !isNaN(Number(defaultValue))) {
      return "number";
    }
    if (
      String(defaultValue).toLowerCase() === "true" ||
      String(defaultValue).toLowerCase() === "false"
    ) {
      return "boolean";
    }
    return "text";
  };

  const validateAndFormatValue = (value: string, defaultValue: unknown) => {
    const inputType = getInputType(defaultValue);

    if (inputType === "number") {
      let numericValue = value.replace(/[^0-9.]/g, "");
      const decimalCount = (numericValue.match(/\./g) || []).length;
      if (decimalCount > 1) {
        numericValue = numericValue.substring(0, numericValue.lastIndexOf("."));
      }
      const parts = numericValue.split(".");
      if (parts[1] && parts[1].length > 2) {
        numericValue = parts[0] + "." + parts[1].substring(0, 2);
      }
      if (numericValue.length > 12) {
        numericValue = numericValue.substring(0, 12);
      }
      return numericValue;
    }

    return value.length > 100 ? value.substring(0, 100) : value;
  };

  const handleAttributeValueChange = useCallback(
    (index: number, value: string) => {
      setTouchedFields(prev => {
        const newSet = new Set(prev).add(index);

        return newSet;
      });
      const item = tableData[index];
      const formattedValue = validateAndFormatValue(value, item.defaultValue);

      setTableData(prev => {
        const updatedData = [...prev];
        updatedData[index].attributeValue = formattedValue;
        return updatedData;
      });
    },
    [tableData]
  );

  const handleBooleanValueChange = useCallback(
    (index: number, checked: boolean) => {
      setTouchedFields(prev => new Set(prev).add(index));
      setTableData(prev => {
        const updatedData = [...prev];
        updatedData[index].attributeValue = String(checked);
        return updatedData;
      });
    },
    []
  );

  const handleStatusChange = useCallback((index: number, checked: boolean) => {
    setTouchedFields(prev => new Set(prev).add(index));
    setTableData(prev => {
      const updatedData = [...prev];
      updatedData[index].status = checked;
      return updatedData;
    });
  }, []);

  const onSubmit = async (onSave?: () => void, onComplete?: () => void) => {
    try {
      if (!currentSchemeId) {
        logger.error("No scheme ID available", { toast: true });
        return;
      }

      const validationErrors = validateTableData(tableData);
      if (validationErrors.length > 0) {
        logger.error(validationErrors[0], { toast: true });
        return;
      }

      const responseData = attributeValuesData?.data || attributeValuesData;
      const attributeMap = new Map();

      tableData.forEach(attr => {
        const typedResponse = responseData as AttributeValuesFormResponse;
        const allOriginalItems = typedResponse?.attributeValues || [];
        const matchedItem = allOriginalItems.find(
          item => item.attributeName === attr.attributeName
        );

        if (
          matchedItem?.attributeIdentity &&
          !attributeMap.has(matchedItem.attributeIdentity)
        ) {
          attributeMap.set(matchedItem.attributeIdentity, attr);
        }
      });

      const transformedPayload = {
        attributeValues: Array.from(attributeMap.entries()).map(
          ([attributeIdentity, attr]) => ({
            attributeIdentity,
            attributeValue: String(attr.attributeValue || ""),
            active: Boolean(attr.status),
          })
        ),
      };

      if (
        !transformedPayload.attributeValues ||
        transformedPayload.attributeValues.length === 0
      ) {
        logger.error("No valid attribute values to submit", { toast: true });
        return;
      }

      const typedResponse = responseData as AttributeValuesFormResponse;
      const hasExistingData = typedResponse?.attributeValues?.some(
        (item: AttributeValueFormApiItem) => item.identity
      );

      const enabledCount = tableData.filter(item => item.status).length;

      if (hasBeenSaved || hasExistingData) {
        await updateAttributeValues({
          schemeIdentity: currentSchemeId,
          payload: transformedPayload,
        }).unwrap();
        logger.info(
          `Attribute values updated successfully (${enabledCount} enabled)`,
          { toast: true }
        );
      } else {
        await createAttributeValues({
          schemeIdentity: currentSchemeId,
          payload: transformedPayload,
        }).unwrap();
        logger.info(
          `Attribute values created successfully (${enabledCount} enabled)`,
          { toast: true }
        );
      }

      setHasBeenSaved(true);
      setTouchedFields(new Set());

      if (onSave) onSave();
      if (onComplete) onComplete();

      setTimeout(async () => {
        await refetchAttributeValues();
      }, 500);
    } catch (error) {
      const apiError = error as { data?: { message?: string; error?: string } };
      const errorMessage =
        apiError.data?.message ||
        apiError.data?.error ||
        "Failed to save attribute values";
      logger.error(errorMessage, { toast: true });
    }
  };

  const handleReset = () => {
    reset(assignAttributeDefaultFormValues);
    setTableData(
      tableData.map(item => ({
        ...item,
        attributeValue: String(item.defaultValue),
        status: false,
      }))
    );
  };

  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = tableData.slice(startIndex, endIndex);
  const firstTableData = currentPageData.slice(0, 15);
  const secondTableData = currentPageData.slice(15, 30);

  return {
    control,
    handleSubmit,
    errors,
    tableData,
    touchedFields,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    firstTableData,
    secondTableData,
    getInputType,
    handleAttributeValueChange,
    handleBooleanValueChange,
    handleStatusChange,
    onSubmit,
    handleReset,
    formState,
    hasUnsavedChanges: touchedFields.size > 0,
    hasBeenSaved,
  };
};
