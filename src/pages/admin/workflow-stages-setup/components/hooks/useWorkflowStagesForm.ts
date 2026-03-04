import { useEffect, useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useLazyGetWorkflowStagesQuery,
  useSaveWorkflowStageMutation,
  useUpdateWorkflowStageMutation,
} from "@/global/service/end-points/workflow/workflow-stages.api";
import {
  useGetAssignedRolesQuery,
  useGetWorkflowDefinitionsQuery,
} from "@/global/service/end-points/workflow/workflow-master-api";
import type {
  WorkflowStageForm,
  WorkflowStageRow,
} from "@/types/admin/workflow-stages";
import { workflowStageSchema } from "@/global/validation/admin/workflow-stagesetup";
import { logger } from "@/global/service";
import { WORKFLOW_STAGE_FORM_DEFAULT_VALUES } from "../../constants/form.constants";

export const useWorkflowStages = () => {
  const pageSize = 5;
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [tableData, setTableData] = useState<WorkflowStageRow[]>([]);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  const [saveWorkflowStage] = useSaveWorkflowStageMutation();
  const [updateWorkflowStage] = useUpdateWorkflowStageMutation();
  const [getWorkflowStages] = useLazyGetWorkflowStagesQuery();

  const { data: workflowData = [] } = useGetWorkflowDefinitionsQuery();
  const { data: rolesData = [] } = useGetAssignedRolesQuery();

  const form = useForm<WorkflowStageForm>({
    resolver: yupResolver(
      workflowStageSchema
    ) as unknown as Resolver<WorkflowStageForm>,
    defaultValues: WORKFLOW_STAGE_FORM_DEFAULT_VALUES,
  });

  const { control, register, handleSubmit, reset, watch, setValue, formState } =
    form;

  const selectedWorkflow = watch("workflowIdentity");

  const workflowOptions = useMemo(
    () =>
      workflowData.map(item => ({
        label: item.workflowName,
        value: item.identity,
      })),
    [workflowData]
  );

  const roleOptions = useMemo(
    () =>
      rolesData.map(item => ({
        label: item.roleName,
        value: item.identity,
      })),
    [rolesData]
  );

  const mapFormToDto = (data: WorkflowStageForm) => ({
    workflowIdentity: data.workflowIdentity!.value,
    levelOrder: Number(data.levelOrder),
    levelName: data.levelName.trim(),
    assignedRoleIdentity: data.assignedRoleIdentity!.value,
    isFinalLevel: data.isFinalLevel,
  });

  const loadStages = async (workflowId: string, page = pageIndex) => {
    try {
      const res = await getWorkflowStages({
        workflowId,
        page,
        size: pageSize,
      }).unwrap();

      setTableData(
        res.content.map(stage => ({
          workflowStageIdentity: stage.workflowStageIdentity,
          workflowIdentity: stage.workflowIdentity,
          levelOrder: stage.levelOrder,
          levelName: stage.levelName,
          assignedRoleIdentity: stage.assignedRoleIdentity,
          isFinalLevel: stage.isFinalLevel,
        }))
      );
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to load stages", error);
    }
  };

  useEffect(() => {
    if (workflowData.length && !selectedWorkflow) {
      setValue("workflowIdentity", {
        label: workflowData[0].workflowName,
        value: workflowData[0].identity,
      });
    }
  }, [workflowData]);

  useEffect(() => {
    if (selectedWorkflow?.value) {
      loadStages(selectedWorkflow.value, pageIndex);
    }
  }, [selectedWorkflow?.value, pageIndex]);

  const onSubmit = async (data: WorkflowStageForm) => {
    const workflowId = data.workflowIdentity!.value;
    const payload = mapFormToDto(data);

    try {
      if (editingStageId) {
        await updateWorkflowStage({
          stageId: editingStageId,
          payload,
        }).unwrap();
      } else {
        await saveWorkflowStage(payload).unwrap();
      }

      reset(WORKFLOW_STAGE_FORM_DEFAULT_VALUES);
      setEditingStageId(null);
      setPageIndex(0);
      logger.info("Workflow Stages Created successfully", { toast: true });
      await loadStages(workflowId, 0);
    } catch (error) {
      logger.error(error, { toast: true });
    }
  };

  const handleEditStage = (row: WorkflowStageRow) => {
    setEditingStageId(row.workflowStageIdentity);

    reset({
      workflowIdentity:
        workflowOptions.find(w => w.value === row.workflowIdentity) ?? null,
      levelOrder: row.levelOrder,
      levelName: row.levelName,
      assignedRoleIdentity:
        roleOptions.find(r => r.value === row.assignedRoleIdentity) ?? null,
      isFinalLevel: row.isFinalLevel,
    });
  };

  const handleDeleteStage = (id: string) => {
    setTableData(prev =>
      prev.filter(item => item.workflowStageIdentity !== id)
    );
  };

  const handleResetForm = () => reset(WORKFLOW_STAGE_FORM_DEFAULT_VALUES);

  return {
    control,
    register,
    handleSubmit,
    formState,
    tableData,
    pageIndex,
    totalPages,
    workflowOptions,
    roleOptions,
    selectedWorkflow,
    setPageIndex,
    onSubmit,
    handleEditStage,
    handleDeleteStage,
    handleResetForm,
  };
};
