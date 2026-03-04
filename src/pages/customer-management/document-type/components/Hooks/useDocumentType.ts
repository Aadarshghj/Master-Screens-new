import { useCallback } from "react";
import { useAppDispatch } from "@/hooks/store";
import toast from "react-hot-toast";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DOCUMENT_TYPE_DEFAULT_VALUES } from "../../constants/DocumentTypeDefault";
import { documentTypeSchema } from "@/global/validation/customer-management-master/document-type";
import type { DocumentType } from "@/types/customer-management/document-type";
import { useSaveDocumentTypeMutation } from "@/global/service/end-points/customer-management/document-type.api";
import { apiInstance } from "@/global/service/api-instance";
import type { DocumentTypeRequestDto } from "@/types/customer-management/document-type";

export const useDocumentType = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentType>({
    defaultValues: DOCUMENT_TYPE_DEFAULT_VALUES,
    resolver: yupResolver(documentTypeSchema) as Resolver<DocumentType>,
    mode: "onBlur",
  });

  const [saveDocumentType] = useSaveDocumentTypeMutation();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    async (data: DocumentType) => {
      const payload: DocumentTypeRequestDto = {
        code: data.documentTypeCode,
        displayName: data.displayName,
        description: data.remarks,
      };
      try {
        await saveDocumentType(payload).unwrap();
        try {
          dispatch(
            apiInstance.util.invalidateTags([
              { type: "DocumentType", id: "LIST" },
            ])
          );
        } catch {
          // ignore
        }
        try {
          // force a refetch as a stronger fallback
          dispatch(
            apiInstance.endpoints.getDocumentTypes.initiate(undefined, {
              forceRefetch: true,
            })
          );
        } catch {
          // ignore
        }
        toast.success("Document master saved successfully");
        reset(DOCUMENT_TYPE_DEFAULT_VALUES);
      } catch {
        toast.error("Failed to save document master");
      }
    },
    [reset, saveDocumentType]
  );

  const onCancel = useCallback(() => {
    reset();
  }, [reset]);

  const onReset = useCallback(() => {
    reset();
  }, [reset]);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onCancel,
    onReset,
  };
};
