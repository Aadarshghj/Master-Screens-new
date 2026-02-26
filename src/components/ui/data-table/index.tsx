import { flexRender, type Table as ReactTable } from "@tanstack/react-table";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

// const tableVariants = cva("overflow-x-auto rounded-lg border", {
//   variants: {
//     size: {
//       default: "",
//       compact: "max-h-32 overflow-y-auto",
//       small: "max-h-24 overflow-y-auto",
//       large: "max-h-48 overflow-y-auto",
//     },
//     variants: {
//       default: "border-collapse border border-gray-400",
//     },
//   },
//   defaultVariants: {
//     size: "default",
//     variants: "default",
//   },
// });
const tableVariants = cva(
  "overflow-x-auto rounded-sm border bg-white shadow-sm",
  {
    variants: {
      size: {
        default: "",
        compact: "max-h-32 overflow-y-auto",
        small: "max-h-24 overflow-y-auto",
        large: "max-h-48 overflow-y-auto",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const tableHeaderVariants = cva("font-normal sticky top-0  z-10", {
  variants: {
    size: {
      default: "text-xs",
      compact: "text-xxs",
      small: "text-xxs",
      large: "text-sm",
    },
    variant: {
      default: "bg-[var(--table-header-default)] inset-shadow-sm border-b ",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

const tableBodyVariants = cva("", {
  variants: {
    size: {
      default: "text-xs",
      compact: "text-xxs",
      small: "text-xxs",
      large: "text-sm",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const tableCellVariants = cva("border-b text-left", {
  variants: {
    type: {
      header: "border-b border-blue-300 font-medium text-white",
      cell: "border-b border-gray-200 text-gray-700",
      empty: "text-center text-gray-500",
    },
    size: {
      default: "px-3 py-1.5",
      compact: "px-2 py-1",
      small: "px-2 py-1",
      large: "px-4 py-2",
    },
  },
  defaultVariants: {
    type: "cell",
    size: "default",
  },
});

const tableRowVariants = cva(
  "transition-colors odd:bg-white even:bg-[#EEF3FF]",
  {
    variants: {
      interactive: {
        true: "hover:bg-blue-50/60",
        false: "",
      },
      size: {
        default: "h-[34px]",
        compact: "h-[32px]",
        small: "h-[32px]",
        large: "h-[38px]",
      },
    },
    defaultVariants: {
      interactive: true,
      size: "default",
    },
  }
);

const tableRowVariantDefault = cva("", {
  variants: {
    size: {
      default: "h-[33px] ",
      compact: "h-[33px]",
      small: "h-[33px]",
      large: "h-[33px]",
    },
    interactive: {
      default: "",
      compact: "",
      small: "",
      large: "",
    },
  },
  defaultVariants: {
    size: "default",
    interactive: "default",
  },
});
const tableRowVariantHeader = cva("", {
  variants: {
    size: {
      default: "h-[33px] ",
      compact: "h-[33px]",
      small: "h-[33px]",
      large: "h-[33px]",
    },
    interactive: {
      default: "inner-shadow-xs",
      compact: "",
      small: "",
      large: "",
    },
  },
  defaultVariants: {
    size: "default",
    interactive: "default",
  },
});

type TableProps<T> = {
  table: ReactTable<T>;
  className?: string;
  noDataText?: string;
} & VariantProps<typeof tableVariants>;

export function CommonTable<T>({
  table,
  className,
  noDataText = "No records found",
  size = "default",
}: TableProps<T>) {
  return (
    <div className={cn(tableVariants({ size }), className, "table-scroll")}>
      <table className="min-w-full border-collapse bg-white">
        <thead className={cn(tableHeaderVariants({ size }))}>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className={cn(tableRowVariantHeader())}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={cn(tableCellVariants({ type: "header", size }))}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className={cn(tableBodyVariants({ size }))}>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={cn(tableRowVariants({ interactive: true }))}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={cn(tableCellVariants({ type: "cell", size }))}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className={cn(tableRowVariantDefault())}>
              <td
                colSpan={table.getAllColumns().length}
                className={cn(
                  tableCellVariants({
                    type: "empty",
                    size:
                      size === "compact" || size === "small"
                        ? "compact"
                        : "default",
                  })
                )}
              >
                {noDataText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
