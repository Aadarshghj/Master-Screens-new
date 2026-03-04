import { Form, Input } from "@/components";
import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";
import { Filter } from "lucide-react";
import { type FC } from "react";
import { useUserLeaveStatusFilter } from "../../hooks/useUserLeaveStatusFilter";
import type { UserLeaveStatusFilterProps } from "@/types/approval-workflow/user-leave-status.types";

const UserLeaveStatusFilter: FC<UserLeaveStatusFilterProps> = ({
  handleSetUserCode,
  handleSetDelegateUserCode,
  handlePageChange,
}) => {
  const { register, handleSubmit, onSubmit } = useUserLeaveStatusFilter({
    handleSetUserCode,
    handleSetDelegateUserCode,
    handlePageChange,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-7 rounded-lg bg-gray-50 p-4 ">
        <Form.Row className="flex flex-wrap justify-between md:flex-nowrap">
          <Form.Row>
            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="User code">
                <Input
                  {...register("userCode")}
                  placeholder="Enter to user code"
                  size="form"
                  variant="form"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={6} span={12}>
              <Form.Field label="Delegate user">
                <Input
                  {...register("delegateUserCode")}
                  placeholder="Enter to delegate user"
                  size="form"
                  variant="form"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>
          </Form.Row>
          <Form.Col lg={2} md={6} span={12}>
            <div className="flex gap-2 pt-5">
              <NeumorphicButton type="submit" variant="default" size="default">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </NeumorphicButton>
            </div>
          </Form.Col>
        </Form.Row>
      </div>
    </form>
  );
};

export default UserLeaveStatusFilter;
