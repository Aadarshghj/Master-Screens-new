import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { RotateCcw, Search } from "lucide-react";
import {
  Select,
  Button,
  Form,
  Flex,
  CommonTable,
  HeaderWrapper,
  TitleHeader,
} from "@/components";
import { DatePicker } from "@/components/ui/date-picker";
import { MaskedInput } from "@/components/ui/masked-input";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { CKYCData, CKYCSearchForm } from "@/types";
import { logger } from "@/global/service";
import { useSearchCkycMutation } from "@/global/service";

interface CKYCSearchProps {
  onSelectCustomer: (customerData: CKYCData) => void;
  onSearchResults?: (results: CKYCData[]) => void;
}

export function CKYCSearchModal({
  onSelectCustomer,
  onSearchResults,
}: CKYCSearchProps) {
  const [searchResults, setSearchResults] = useState<CKYCData[]>([]);
  const [isSearched, setIsSearched] = useState(false);

  const [searchCkyc, { isLoading: isSearching }] = useSearchCkycMutation();

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CKYCSearchForm>({
    defaultValues: {
      kycType: "",
      aadhaarNumber: "",
      dob: "",
    },
  });

  const columnHelper = createColumnHelper<CKYCData>();
  const columns = [
    columnHelper.accessor("ckycNumber", {
      header: "CKYC Number",
      cell: info => (
        <span className="text-foreground text-xs font-medium">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("customerName", {
      header: "Customer Name",
      cell: info => (
        <span className="text-foreground text-xs">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("fatherName", {
      header: "Father's Name",
      cell: info => (
        <span className="text-muted-foreground text-xs">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("gender", {
      header: "Gender",
      cell: info => (
        <span className="text-muted-foreground text-xs">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("dob", {
      header: "DOB",
      cell: info => (
        <span className="text-muted-foreground text-xs">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("mobile", {
      header: "Mobile",
      cell: info => (
        <span className="text-muted-foreground text-xs">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("city", {
      header: "City",
      cell: info => (
        <span className="text-muted-foreground text-xs">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="default"
          onClick={() => {
            const customer = row.original;
            onSelectCustomer(customer);
            logger.info("CKYC customer selected", { pushLog: false });
          }}
        >
          Edit →
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: searchResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = async (data: CKYCSearchForm) => {
    try {
      const results = await searchCkyc(data).unwrap();
      setSearchResults(results);
      setIsSearched(true);

      if (onSearchResults) {
        onSearchResults(results);
      }

      logger.info("CKYC search completed");
    } catch (error) {
      logger.error(error);
      setSearchResults([]);
      setIsSearched(true);
    }
  };

  const kycTypeOptions = [
    { value: "aadhaar", label: "Aadhaar Card" },
    { value: "pan", label: "PAN Card" },
    { value: "passport", label: "Passport" },
    { value: "driving_license", label: "Driving License" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Row className="mb-3 gap-3">
            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="KYC Type">
                <Controller
                  name="kycType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSearching}
                      placeholder="Select"
                      size="form"
                      variant="form"
                      fullWidth={true}
                      options={kycTypeOptions}
                    />
                  )}
                />
                <Form.Error error={errors.kycType} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="Aadhaar Card Number">
                <Controller
                  name="aadhaarNumber"
                  control={control}
                  render={({ field }) => (
                    <MaskedInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="xxxx xxxx xxxx"
                      size="form"
                      variant="form"
                      disabled={isSearching}
                      className="text-xs"
                    />
                  )}
                />
                <Form.Error error={errors.aadhaarNumber} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <Form.Field label="DOB">
                <DatePicker
                  value={watch("dob") || undefined}
                  onChange={(value: string) => setValue("dob", value)}
                  placeholder="dd/mm/yyyy"
                  allowManualEntry={true}
                  disabled={isSearching}
                  size="form"
                  variant="form"
                />
                <Form.Error error={errors.dob} />
              </Form.Field>
            </Form.Col>

            <Form.Col lg={3} md={6} span={12}>
              <div className="mt-3">
                <Flex gap={2} justify="end">
                  <Button
                    type="button"
                    onClick={() => {
                      reset();
                      setSearchResults([]);
                      setIsSearched(false);
                    }}
                    disabled={isSearching}
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isSearching}
                  >
                    <Search className="mr-1 h-3 w-3" />
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </Flex>
              </div>
            </Form.Col>
          </Form.Row>
        </Form>
      </div>

      <div>
        <Flex justify="between" align="center" className="mb-3">
          <HeaderWrapper>
            <TitleHeader
              title={`CKYC Search Results${
                isSearched ? ` (${searchResults.length} results found)` : ""
              }`}
            />
          </HeaderWrapper>
        </Flex>

        <div className="rounded-md border">
          <CommonTable
            table={table}
            size="default"
            noDataText={
              isSearched
                ? "No CKYC records found"
                : "Please search to view results"
            }
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}
