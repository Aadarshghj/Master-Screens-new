import { useCallback, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import type {
  Bank,
  BankRequestDto,
  Option,
} from "@/types/customer-management/bank";

import { useSaveBankMutation } from "@/global/service/end-points/customer-management/bank";
import { useGetCountriesQuery } from "@/global/service/end-points/customer-management/bank";

import { logger } from "@/global/service";
import { bankSchema } from "@/global/validation/customer-management-master/bank";
import { BANK_DEFAULT_VALUES } from "../../constants/Banks";

export const useBankForm = () => {
  const [saveBank] = useSaveBankMutation();
  const { data: countries = [] } = useGetCountriesQuery();

  const countryOptions: Option[] = useMemo(
    () =>
      countries.map(item => ({
        value: item.id,
        label: item.countryName,
      })),
    [countries]
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Bank>({
    defaultValues: BANK_DEFAULT_VALUES,
    resolver: yupResolver(bankSchema) as Resolver<Bank>,
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (data: Bank) => {
      const payload: BankRequestDto = {
        bankName: data.bankName.trim(),
        bankCode: data.bankCode.trim(),
        swiftBic: data.swiftBicCode.trim(),
        countryIdentity: data.country,
        isPsu: data.psu,
      };

      try {
        await saveBank(payload).unwrap();
        logger.info("Bank saved successfully", { toast: true });
        reset(BANK_DEFAULT_VALUES);
      } catch (error) {
        logger.error(error, { toast: true });
      }
    },
    [saveBank, reset]
  );

  const onCancel = useCallback(() => {
    reset(BANK_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(BANK_DEFAULT_VALUES);
  }, [reset]);

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    countryOptions,
    onSubmit,
    onCancel,
    onReset,
  };
};
