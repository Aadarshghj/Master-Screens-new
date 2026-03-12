// import React, { useMemo } from "react";
// import { Grid, CommonTable } from "@/components/ui";
// import {
//   createColumnHelper,
//   getCoreRowModel,
// //   getPaginationRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// // import {  SquarePen, Trash2 } from "lucide-react";
// import { useQuotRegTable } from '../Hooks/useQuotationRegistrationTable';
// import type { QuotationReqData } from "@/types/asset-management-system/quotation-registration-type";
// import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button";

// const columnHelper = createColumnHelper<QuotationReqData>();

// interface ProductListTableProps {
//   filters:{
//     product: string;
//     status: string;
//   }
// }

// <QuotationRegistrationTable  />
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
          
//         </Grid.Item>
//       </Grid>
//     </>
//   );
// };
