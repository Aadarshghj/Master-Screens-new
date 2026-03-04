import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type {
  DocumentMaster,
  DocumentMasterRequestDto,
} from "@/types/customer-management/document-master";
import { DEFAULT_VALUES } from "../../constants/DocumentMasterFormDefault";
import { documentMasterSchema } from "@/global/validation/customer-management-master/document-master";
import { useSaveDocumentMasterMutation } from "@/global/service/end-points/customer-management/document-master.api";
import toast from "react-hot-toast";

export const useDocumentMaster = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentMaster>({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(documentMasterSchema),
    mode: "onBlur",
  });

  const [saveDocumentMaster] = useSaveDocumentMasterMutation();

  const onSubmit = useCallback(
    async (data: DocumentMaster) => {
      const payload: DocumentMasterRequestDto = {
        docCode: data.documentCode,
        docName: data.documentName,
        docCategory: data.documentCategory,
        isIdentityProof: data.identityProof,
        isAddressProof: data.addressProof,
      };
      try {
        await saveDocumentMaster(payload).unwrap();
        reset(DEFAULT_VALUES);
        toast.success("Document master saved successfully");
      } catch {
        toast.error("Failed to save document master");
      }
    },
    [reset, saveDocumentMaster]
  );

  const onCancel = useCallback(() => {
    reset(DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(DEFAULT_VALUES);
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
