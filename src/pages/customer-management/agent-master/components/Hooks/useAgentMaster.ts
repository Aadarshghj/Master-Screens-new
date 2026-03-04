import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { AgentMasterType } from "@/types/customer-management/agent-master";
import { AGENT_MASTER_DEFAULT_VALUES } from "../../constants/AgentMasterDefault";
import { agentMasterSchema } from "@/global/validation/customer-management-master/agent-master";
import { useSaveAgentMasterMutation } from "@/global/service/end-points/customer-management/agent-master.api";
import toast from "react-hot-toast";

export const useAgentMaster = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AgentMasterType>({
    defaultValues: AGENT_MASTER_DEFAULT_VALUES,
    resolver: yupResolver(agentMasterSchema),
    mode: "onBlur",
  });

  const [saveAgentMaster] = useSaveAgentMasterMutation();

  const onSubmit = useCallback(
    async (data: AgentMasterType) => {
      try {
        await saveAgentMaster(data).unwrap();
        reset(AGENT_MASTER_DEFAULT_VALUES);
        toast.success("Agent Master saved successfully");
      } catch {
        toast.error("Failed to save Agent Master");
      }
    },
    [reset, saveAgentMaster]
  );

  const onCancel = useCallback(() => {
    reset(AGENT_MASTER_DEFAULT_VALUES);
  }, [reset]);

  const onReset = useCallback(() => {
    reset(AGENT_MASTER_DEFAULT_VALUES);
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
