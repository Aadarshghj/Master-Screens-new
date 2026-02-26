import React, { useMemo } from "react";
import { Grid, CommonTable, Button, ConfirmationModal } from "@/components";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  UserRegType
} from "@/types/customer-management/user-reg";



import { Pencil, Trash2 } from "lucide-react";
import { useUserRegTable } from "../hooks/useUserRegTable";
import { USER_TYPE_OPTIONS } from "@/mocks/customer-management-master/user-reg";
const columnHelper = createColumnHelper<UserRegType>();

interface UserRegTableProps{
  onEdit:(identity:UserRegType)=>void;
}
export const UserRegTable: React.FC<UserRegTableProps> = ({onEdit,}) => {

   const {
      data,
      isFetching,
      showDeleteModal,
      openDeleteModal,
      closeDeleteModal,
      confirmDeleteUserRegistration,
    } = useUserRegTable();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row }) => row.index + 1,
      }),

      columnHelper.accessor("userCode", {
        header: "User Code",
      }),
      columnHelper.accessor("userName", {
        header: "User Name",
      }),

      columnHelper.accessor("email", {
        header: "Email",
      }),

      columnHelper.accessor("phoneNumber", {
        header: "Contact Number",
      }),
            columnHelper.accessor("fullName", {
        header: "Full Name",
      }),

          columnHelper.accessor("userType", {
      header: "User Type",
      cell: info => {
        const type = String(info.getValue()); 

        const found = USER_TYPE_OPTIONS.find(
          o => o.value === type
        );

        return found?.label ?? type;
      },
    }),

      columnHelper.accessor("isActive", {
        header: "Status",
        cell:info=>{
          const isActive = Boolean(info.getValue());
          return(
            <span className={`text-xs font-medium ${isActive?"text-green-600":"text-red-600"}`}>
              {isActive ? "ACTIVE":"INACTIVE"}

            </span>
          )
        }
      }),

      

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({row}) => {
          const userId =row.original.id
          return(
             <div className="flex gap-2">

            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/40 h-6 w-6 p-0"
              title="Edit user"
              onClick={()=>onEdit(row.original)}
            >
              <Pencil size={13} />
            </Button>

            <button
              title="Delete"
            onClick={() => {if (!userId) return; openDeleteModal(userId)}}
            className="text-destructive hover:opacity-80"
              
            >
              <Trash2 size={13} />
            </button>
          </div>
          );
        },
         
        
      }),
    ],
    [openDeleteModal]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  

  return (
    <>
      <Grid>
        <Grid.Item>
          <CommonTable
            table={table}
            noDataText={
              isFetching ? "Loading..." : "No user records available"
            }
            className="bg-card"
          />
        </Grid.Item>
      </Grid>
       <ConfirmationModal
              isOpen={showDeleteModal}
              onConfirm={confirmDeleteUserRegistration}
              onCancel={closeDeleteModal}
              title="Delete User"
              message="Are you sure you want to delete this user? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              type="error"
              size="compact"
            />

    
    </>
  );
};
