import { useForm } from "react-hook-form"
import { RefreshCw, Search } from "lucide-react"

import {
  Button,
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
  useReactTable
} from "@tanstack/react-table"

import type {
  SupplierSearchForm,
  SupplierSearchResult
} from "@/types/asset-management-system/supplier-empanelment"

import { MOCK_SUPPLIERS } from "@/mocks/asset-management-system/supplier-empanelment"

import { useSupplierSearchTable } from "../Hooks/useSupplierEmpanelSearchTable"

interface SupplierSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function SupplierSearchModal({ isOpen, onClose }: SupplierSearchProps) {

  const { tableData, setSearchResults, resetTable } = useSupplierSearchTable()

  const {
    handleSubmit,
    reset,
    register
  } = useForm<SupplierSearchForm>()

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
      header: "GST Number",
      cell: info => <span className="text-xs">{info.getValue()}</span>
    }),

    columnHelper.display({
      id: "action",
      header: "Action",
      cell: () => (
        <Button size="sm">
          Select →
        </Button>
      )
    })
  ]

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const onSubmit = () => {
    setSearchResults(MOCK_SUPPLIERS)
  }

  const handleReset = () => {
    reset()
    resetTable()
  }

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      width="5xl"
      title="Search Supplier"
      titleVariant="small"
      className="!h-[80vh] !w-[95vw] !max-w-[95vw]"
    >

      <Form onSubmit={handleSubmit(onSubmit)}>

        <div className="space-y-4">

          <Form.Row className="gap-3">

            <Form.Col lg={3} span={12}>
              <Form.Field label="Supplier Name">
                <Input
                  {...register("supplierName")}
                  placeholder="Enter supplier name"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} span={12}>
              <Form.Field label="Trade Name">
                <Input
                  {...register("tradeName")}
                  placeholder="Enter trade name"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} span={12}>
              <Form.Field label="PAN Number">
                <Input
                  {...register("panNumber")}
                  placeholder="Enter PAN number"
                  textTransform="uppercase"
                />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} span={12}>
              <Form.Field label="GST Number">
                <Input
                  {...register("gstNumber")}
                  placeholder="Enter GST number"
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

            <NeumorphicButton
              type="submit"
              variant="default"
            >
              <Search width={12} />
              Search
            </NeumorphicButton>

          </Flex>

        </div>

      </Form>

      <div className="mt-4">

        <HeaderWrapper>
          <TitleHeader title="Supplier List" />
        </HeaderWrapper>

        <div className="rounded-md border">

          <CommonTable
            table={table}
            size="compact"
            noDataText="Search suppliers to view results"
          />

        </div>

      </div>

    </Modal>
  )
}