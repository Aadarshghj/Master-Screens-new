import { ASSET_MODEL_SAMPLE_DATA } from "@/mocks/customer-management-master/asset-master/asset-model"
import type { AssetModelRequestDto, AssetModelType, Option } from "@/types/customer-management/asset-master/asset-model"
import { useCallback, useMemo } from "react"
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, type Resolver } from "react-hook-form";
import { ASSET_MODEL_DEFAULT_VALUES } from "../../constants/AssetModelDefault";
import { assetModelSchema } from "@/global/validation/customer-management-master/asset-master/asset-model";
import { logger } from "@/global/service";

export const useAssetModelForm = ()=>{
    const assetItemOptions: Option[] = useMemo(() => {
  return Array.from(
    new Set(ASSET_MODEL_SAMPLE_DATA.map(item => item.assetItem))
  ).map(assetItem => ({
    value: assetItem,
    label: assetItem,
  }));
}, []);
const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
      } = useForm<AssetModelType>({
        defaultValues: ASSET_MODEL_DEFAULT_VALUES,
        resolver: yupResolver(assetModelSchema) as Resolver<AssetModelType>,
        mode: "onChange",
      });
    
      const onSubmit = useCallback(
        async (data: AssetModelType) => {
          const payload: AssetModelRequestDto = {
            assetitem:data.assetItem,
            assetcode:data.assetModelCode,
            desc:data.description,
          };
    
          try {
            await payload
            logger.info("Asset model saved successfully", { toast: true });
            reset(ASSET_MODEL_DEFAULT_VALUES);
          } catch (error) {
            logger.error(error, { toast: true });
          }
        },
        [ reset]
      );
    
      const onCancel = useCallback(() => {
        reset(ASSET_MODEL_DEFAULT_VALUES);
      }, [reset]);
    
      const onReset = useCallback(() => {
        reset(ASSET_MODEL_DEFAULT_VALUES);
      }, [reset]);
    
      return {
        control,
        register,
        handleSubmit,
        errors,
        isSubmitting,
        assetItemOptions,
        onSubmit,
        onCancel,
        onReset,
      };
    };
    