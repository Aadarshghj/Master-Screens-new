import { useState } from "react";
import { Button, Input, CommonTable, Form, Modal } from "@/components";
import { RotateCcw, Trash2 } from "lucide-react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface ReverseInterestItem {
  startPeriod: number;
  endPeriod: number;
  slabRate: number;
}

interface ReverseInterestProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleDisable: () => void;
}

interface ReverseInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleDisable?: () => void;
}

function ReverseInterest({
  isOpen,
  onClose,
  onToggleDisable,
}: ReverseInterestProps) {
  const handleClose = () => {
    onToggleDisable();
    onClose();
  };
  const [startPeriod, setStartPeriod] = useState("");
  const [endPeriod, setEndPeriod] = useState("");
  const [slabRate, setSlabRate] = useState("");

  const [items, setItems] = useState<ReverseInterestItem[]>([
    { startPeriod: 0, endPeriod: 30, slabRate: 25 },
  ]);

  const handleSave = () => {
    if (!startPeriod || !endPeriod || !slabRate) return;

    const newItem = {
      startPeriod: Number(startPeriod),
      endPeriod: Number(endPeriod),
      slabRate: Number(slabRate),
    };

    setItems([...items, newItem]);

    setStartPeriod("");
    setEndPeriod("");
    setSlabRate("");
  };

  const handleReset = () => {
    setStartPeriod("");
    setEndPeriod("");
    setSlabRate("");
  };

  const deleteItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const columnHelper = createColumnHelper<ReverseInterestItem>();
  const columns = [
    columnHelper.accessor("startPeriod", {
      header: "Start Period",
      cell: info => <span className="text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("endPeriod", {
      header: "End Period",
      cell: info => <span className="text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor("slabRate", {
      header: "Slab Interest Rate",
      cell: info => <span className="text-xs">{info.getValue()}%</span>,
    }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Trash2
          className="h-4 w-4 cursor-pointer text-red-500"
          onClick={() => deleteItem(row.index)}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Modal
      isOpen={isOpen}
      close={handleClose}
      width="5xl"
      maxHeight="95vh"
      className="!h-[90vh] !w-[90vw] !max-w-[90vw]"
      isClosable={true}
      titleVariant="default"
    >
      <div>
        {/* TITLE */}
        <h2 className="mb-6 text-base font-medium">Reverse Interest</h2>

        {/* INPUT ROW WITH BUTTONS */}
        <Form.Row className="mt-4 gap-6">
          <Form.Col span={3}>
            <Form.Field label="Start Period*">
              <Input
                placeholder="Enter Start Period"
                value={startPeriod}
                onChange={e => setStartPeriod(e.target.value)}
                size="form"
              />
            </Form.Field>
          </Form.Col>

          <Form.Col span={3}>
            <Form.Field label="End Period*">
              <Input
                placeholder="Enter End Period"
                value={endPeriod}
                onChange={e => setEndPeriod(e.target.value)}
                size="form"
              />
            </Form.Field>
          </Form.Col>

          <Form.Col span={3}>
            <Form.Field label="Slab Interest Rate*">
              <Input
                placeholder="Enter Slab Interest Rate"
                value={slabRate}
                onChange={e => setSlabRate(e.target.value)}
                size="form"
              />
            </Form.Field>
          </Form.Col>

          <Form.Col span={3}>
            <Form.Field>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="resetPrimary"
                  size="compactWhite"
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                <Button
                  variant="primary"
                  size="default"
                  onClick={handleSave}
                  className="w-20"
                >
                  Save
                </Button>
              </div>
            </Form.Field>
          </Form.Col>
        </Form.Row>

        <h2 className="mt-10 text-base font-medium">Reverse Interest List</h2>

        <div className="mt-4 rounded-md border">
          <CommonTable
            table={table}
            size="compact"
            noDataText="No reverse interest records"
          />
        </div>
      </div>
    </Modal>
  );
}

export function ReverseInterestModal({
  isOpen,
  onClose,
  onToggleDisable = () => {},
}: ReverseInterestModalProps) {
  return (
    <ReverseInterest
      isOpen={isOpen}
      onClose={onClose}
      onToggleDisable={onToggleDisable}
    />
  );
}

export default ReverseInterest;
