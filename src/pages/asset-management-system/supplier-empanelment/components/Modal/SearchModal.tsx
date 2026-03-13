import { useForm } from "react-hook-form"
import { useState } from "react"
import { RefreshCw, Search } from "lucide-react"

import {
  Form,
  Flex,
  Input,
  CommonTable,
  HeaderWrapper,
  TitleHeader,
  Modal
} from "@/components"

import NeumorphicButton from "@/components/ui/neumorphic-button/neumorphic-button"

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table"

import type {
  SupplierSearchForm,
  SupplierSearchResult
} from "@/types/asset-management-system/supplier-empanelment"

import { MOCK_SUPPLIERS } from "@/mocks/asset-management-system/supplier-empanelment"
import { Pagination } from "@/components/ui/paginationUp"

interface SupplierSearchProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (supplier: SupplierSearchResult) => void
}

export function SupplierSearchModal({ isOpen, onClose, onSelect }: SupplierSearchProps) {

  const [tableData, setTableData] = useState<SupplierSearchResult[]>(MOCK_SUPPLIERS)

  const { handleSubmit, reset, register } = useForm<SupplierSearchForm>()

  const columnHelper = createColumnHelper<SupplierSearchResult>()

  const columns = [
    columnHelper.accessor("supplierName", {
      header: "Supplier Name",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("tradeName", {
      header: "Trade Name",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("panNumber", {
      header: "PAN Number",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("gstNumber", {
      header: "GSTIN",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("msmeRegistrationNo", {
      header: "MSME Registration No",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("address", {
      header: "Address",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("city", {
      header: "City",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("state", {
      header: "State",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("country", {
      header: "Country",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.accessor("pincode", {
      header: "Pincode",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <button className="cursor-pointer" onClick={() => onSelect(row.original)}>
          Select →
        </button>
      )
    })
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 2
      }
    }
  })

  const onSubmit = (data: SupplierSearchForm) => {

    const filtered = MOCK_SUPPLIERS.filter(supplier =>
      (!data.supplierName || supplier.supplierName.toLowerCase().includes(data.supplierName.toLowerCase())) &&
      (!data.tradeName || supplier.tradeName.toLowerCase().includes(data.tradeName.toLowerCase())) &&
      (!data.panNumber || supplier.panNumber.toLowerCase().includes(data.panNumber.toLowerCase())) &&
      (!data.gstNumber || supplier.gstNumber.toLowerCase().includes(data.gstNumber.toLowerCase()))
    )

    setTableData(filtered)
  }

  const handleReset = () => {
    reset()
    setTableData(MOCK_SUPPLIERS)
  }

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      width="4xl"
      title="Supplier Search"
      titleVariant="small"
      className="!h-[60vh] !w-[95vw] !max-w-[95vw]"
    >

      <Form onSubmit={handleSubmit(onSubmit)}>

        <div className="space-y-4">

          <Form.Row className="gap-5">

            <Form.Col lg={2} md={3} span={12}>
              <Form.Field label="Supplier Name">
                <Input
                  {...register("supplierName")}
                  placeholder="Enter Supplier Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={3} span={12}>
              <Form.Field label="Trade Name">
                <Input
                  {...register("tradeName")}
                  placeholder="Enter Trade Name"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={3} span={12}>
              <Form.Field label="PAN Number">
                <Input
                  {...register("panNumber")}
                  placeholder="Enter PAN number"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={2} md={3} span={12}>
              <Form.Field label="GST Number">
                <Input
                  {...register("gstNumber")}
                  placeholder="Enter GST number"
                  size="form"
                  variant="form"
                  className="uppercase"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

          </Form.Row>

          <Flex justify="end" gap={2}>

            <NeumorphicButton
              type="button"
              variant="secondary"
              onClick={handleReset}
            >
              <RefreshCw width={12} />
              Reset
            </NeumorphicButton>

            <NeumorphicButton type="submit" variant="default">
              <Search width={12} />
              Search
            </NeumorphicButton>

          </Flex>

        </div>

      </Form>

      <div className="mt-4">

        <HeaderWrapper>
          <TitleHeader title="Supplier Search View" className="pb-4 " />
        </HeaderWrapper>

        <div className="rounded-md border">
          

          <CommonTable
            table={table}
            size="compact"
            noDataText="No suppliers found"
            
          />

        </div>
       {table.getRowModel().rows.length > 0 && table.getPageCount() > 0 && (
         <div className="mt-4 flex items-center justify-end text-sm">
       
           <div className="flex items-center gap-3">
             <Pagination
               currentPage={table.getState().pagination.pageIndex}
               totalPages={table.getPageCount()}
               onPageChange={(page) => table.setPageIndex(page)}
       
               onPreviousPage={() => table.previousPage()}
               onNextPage={() => table.nextPage()}
       
               canPreviousPage={table.getCanPreviousPage()}
               canNextPage={table.getCanNextPage()}
               maxVisiblePages={5}
             />
           </div>
       
         </div>
       )}
        
      </div>

    </Modal>
  )
}