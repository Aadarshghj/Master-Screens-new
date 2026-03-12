// import React, { useMemo } from "react";
// import { Grid, CommonTable } from "@/components/ui";
// import {
//   createColumnHelper,
//   getCoreRowModel,
//   getPaginationRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Eye, SquarePen, Trash2 } from "lucide-react";
// import { useProductReqListTable } from '../Hooks/useProductReqListTable';
// import type { ProductReqList } from "@/types/asset-mgmt/product-req-list";
// import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

// const columnHelper = createColumnHelper<ProductReqList>();

// interface ProductListTableProps {
//   filters:{
//     product: string;
//     status: string;
//   }
// }

// export const ProductReqListTable: React.FC<ProductListTableProps> = ({filters}) => {
//   const { data, isFetching} = useProductReqListTable();

//  const columns = useMemo(
//   () => [
//     columnHelper.display({
//       id: "sno",
//       header: "S.No",
//       cell: ({ row }) => row.index + 1,
//     }),

//     columnHelper.accessor("request", {
//       header: "Request",
//     }),

//     columnHelper.accessor("product", {
//       header: "Product",
//     }),

//     columnHelper.accessor("remarks", {
//       header: "Remarks / Specification",
//     }),

//     columnHelper.accessor("quantity", {
//       header: "Quantity",
//       cell: (info) => `${info.getValue()} ${info.row.original.unit}`,
//     }),

//     columnHelper.accessor("requestedBy", {
//       header: "Requested By",
//     }),

//     columnHelper.accessor("requestedOn", {
//       header: "Requested On",
//     }),

//     columnHelper.accessor("status", {
//       header: "Status",
//       cell: (info) => {
//         const value = info.getValue();

//   const baseStyle =
//       "min-w-[80px] px-2.5 py-.5 text-xs font-medium rounded-full border transition-colors duration-200 inline-flex items-center justify-center";

//     const statusStyle =
//       value === "Pending"
//         ? "border-yellow-500 text-yellow-500 bg-yellow-50"
//         : value === "Draft"
//         ? "border-blue-600 text-blue-500 bg-blue-50"
//         : value === "Approved"
//         ? "border-teal-500 text-teal-500 bg-teal-50"
//         : "border-gray-300 text-gray-500 bg-gray-50";

//     return (
//       <span className={`${baseStyle} ${statusStyle}`}>
//         {value}
//       </span>
//     );
//       },
//     }),

//     columnHelper.display({
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => {
//         const status = row.original.status;

//         return (
//           <div className="flex items-center gap-3">
//             <NeumorphicButton
//               variant="none"
//               className="h-6 w-6 p-0"
//             >
//               <Eye size={12} />
//             </NeumorphicButton>

//             {status === "Draft" && (
//               <>
//                 <NeumorphicButton
//                   variant="none"
//                   className="h-6 w-6 p-0"
//                 >
//                   <SquarePen size={12} />
//                 </NeumorphicButton>

//                 <NeumorphicButton
//                   variant="none"
//                   className="text-status-error h-6 w-6 p-0"
//                 >
//                   <Trash2 size={12} />
//                 </NeumorphicButton>
//               </>
//             )}
//           </div>
//         );
//       },
//     }),
//   ],
//   []
// );
// console.log("Full Data:", data);

// const filteredData = React.useMemo(() => {
//   return data.filter((item) => {
//     const matchProduct =
//       !filters.product ||
//       filters.product === "ALL" ||
//       item.product.toLowerCase() === filters.product.toLowerCase();

//     const matchStatus =
//       !filters.status ||
//       filters.status === "ALL" ||
//       item.status.toLowerCase() === filters.status.toLowerCase();

//     return matchProduct && matchStatus;
//   });
// }, [data, filters]);

// console.log("Filters:", filters);
// console.log("Filtered result:", filteredData);

//   const table = useReactTable({
//     data: filteredData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     initialState: {
//       pagination: {
//         pageIndex: 0,
//         pageSize: 5,
//       },
//     },
//   });

//   return (
//     <>
//       <Grid>
//         <Grid.Item>
//           <CommonTable
//             table={table}
//             size="default"
//             noDataText={isFetching ? "Loading..." : "No records available"}
//             className="bg-card"
//           />
//           <div className="flex items-center justify-end gap-2 mt-4 text-sm">
  
//   <button
//     onClick={() => table.previousPage()}
//     disabled={!table.getCanPreviousPage()}
//     className="px-2 py-1 rounded text-gray-500 hover:text-gray-700 disabled:opacity-40"
//   >
//     ‹ Previous
//   </button>

//   {Array.from({ length: table.getPageCount() }, (_, i) => {
//     const isActive = table.getState().pagination.pageIndex === i;

//     return (
//       <button
//         key={i}
//         onClick={() => table.setPageIndex(i)}
//         className={`
//           min-w-[20px] h-[20px] flex items-center justify-center
//           rounded-lg font-medium transition-all duration-200
//           ${isActive
//             ? "bg-white text-gray-700 shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
//             : "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-[0_2px_6px_rgba(0,0,0,0.12)] hover:-translate-y-[1px]"
//           }
//         `}
//       >
//         {i + 1}
//       </button>
//     );
//   })}

//   <button
//     onClick={() => table.nextPage()}
//     disabled={!table.getCanNextPage()}
//     className="px-2 py-1 rounded text-gray-500 hover:text-gray-700 disabled:opacity-40"
//   >
//     Next ›
//   </button>

// </div>
//         </Grid.Item>
//       </Grid>
//     </>
//   );
// };
