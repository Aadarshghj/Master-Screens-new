// import * as React from "react";
// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   MoreHorizontalIcon,
// } from "lucide-react";
// import { cn } from "@/utils/index";
// import { buttonVariants } from "@/components/ui/button";
// import {
//   paginationVariants,
//   paginationContentVariants,
//   paginationPreviousVariants,
//   paginationNextVariants,
//   paginationEllipsisVariants,
// } from "./variants";

// // Base components (keep these for internal use)
// function PaginationRoot({ className, ...props }: React.ComponentProps<"nav">) {
//   return (
//     <nav
//       role="navigation"
//       aria-label="pagination"
//       data-slot="pagination"
//       className={cn(paginationVariants(), className)}
//       {...props}
//     />
//   );
// }

// function PaginationContent({
//   className,
//   ...props
// }: React.ComponentProps<"ul">) {
//   return (
//     <ul
//       data-slot="pagination-content"
//       className={cn(paginationContentVariants(), className)}
//       {...props}
//     />
//   );
// }

// function PaginationItem({ ...props }: React.ComponentProps<"li">) {
//   return <li data-slot="pagination-item" {...props} />;
// }

// export type PaginationLinkProps = {
//   isActive?: boolean;
//   size?: "default" | "sm" | "lg" | "icon";
// } & React.ComponentProps<"a">;

// function PaginationLink({
//   className,
//   isActive,
//   size = "icon",
//   ...props
// }: PaginationLinkProps) {
//   return (
//     <a
//       aria-current={isActive ? "page" : undefined}
//       data-slot="pagination-link"
//       data-active={isActive}
//       className={cn(
//         buttonVariants({
//           variant: isActive ? "outline" : "ghost",
//           size,
//         }),
//         "cursor-pointer text-black",
//         className
//       )}
//       {...props}
//     />
//   );
// }

// function PaginationPrevious({
//   className,
//   ...props
// }: React.ComponentProps<typeof PaginationLink>) {
//   return (
//     <PaginationLink
//       aria-label="Go to previous page"
//       size="default"
//       className={cn(paginationPreviousVariants(), "text-black", className)}
//       {...props}
//     >
//       <ChevronLeftIcon />
//       <span className="hidden sm:block">Previous</span>
//     </PaginationLink>
//   );
// }

// function PaginationNext({
//   className,
//   ...props
// }: React.ComponentProps<typeof PaginationLink>) {
//   return (
//     <PaginationLink
//       aria-label="Go to next page"
//       size="default"
//       className={cn(paginationNextVariants(), "text-black", className)}
//       {...props}
//     >
//       <span className="hidden sm:block">Next</span>
//       <ChevronRightIcon />
//     </PaginationLink>
//   );
// }

// function PaginationEllipsis({
//   className,
//   ...props
// }: React.ComponentProps<"span">) {
//   return (
//     <span
//       aria-hidden
//       data-slot="pagination-ellipsis"
//       className={cn(paginationEllipsisVariants(), className)}
//       {...props}
//     >
//       <MoreHorizontalIcon className="size-4" />
//       <span className="sr-only">More pages</span>
//     </span>
//   );
// }

// // Unified Pagination Component
// interface UnifiedPaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
//   onPreviousPage: () => void;
//   onNextPage: () => void;
//   canPreviousPage: boolean;
//   canNextPage: boolean;
//   maxVisiblePages?: number;
//   className?: string;
// }

// export function Pagination({
//   currentPage,
//   totalPages,
//   onPageChange,
//   onPreviousPage,
//   onNextPage,
//   canPreviousPage,
//   canNextPage,
//   maxVisiblePages = 5,
//   className,
// }: UnifiedPaginationProps) {
//   const renderPaginationItems = () => {
//     const items = [];

//     let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
//     const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

//     if (endPage - startPage < maxVisiblePages - 1) {
//       startPage = Math.max(0, endPage - maxVisiblePages + 1);
//     }

//     // First page + ellipsis
//     if (startPage > 0) {
//       items.push(
//         <PaginationItem key="first">
//           <PaginationLink
//             onClick={() => onPageChange(0)}
//             isActive={false}
//             size="icon"
//           >
//             1
//           </PaginationLink>
//         </PaginationItem>
//       );
//       if (startPage > 1) {
//         items.push(
//           <PaginationItem key="ellipsis-start">
//             <PaginationEllipsis />
//           </PaginationItem>
//         );
//       }
//     }

//     // Visible page range
//     for (let i = startPage; i <= endPage; i++) {
//       items.push(
//         <PaginationItem key={i}>
//           <PaginationLink
//             onClick={() => onPageChange(i)}
//             isActive={currentPage === i}
//             size="icon"
//           >
//             {i + 1}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }

//     // Last page + ellipsis
//     if (endPage < totalPages - 1) {
//       if (endPage < totalPages - 2) {
//         items.push(
//           <PaginationItem key="ellipsis-end">
//             <PaginationEllipsis />
//           </PaginationItem>
//         );
//       }
//       items.push(
//         <PaginationItem key="last">
//           <PaginationLink
//             onClick={() => onPageChange(totalPages - 1)}
//             isActive={false}
//             size="icon"
//           >
//             {totalPages}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }

//     return items;
//   };

//   return (
//     <PaginationRoot className={className}>
//       <PaginationContent>
//         <PaginationItem>
//           <PaginationPrevious
//             onClick={onPreviousPage}
//             aria-disabled={!canPreviousPage}
//             size="default"
//             className={
//               !canPreviousPage
//                 ? "pointer-events-none opacity-50"
//                 : "cursor-pointer"
//             }
//           />
//         </PaginationItem>

//         {renderPaginationItems()}

//         <PaginationItem>
//           <PaginationNext
//             onClick={onNextPage}
//             aria-disabled={!canNextPage}
//             size="default"
//             className={
//               !canNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"
//             }
//           />
//         </PaginationItem>
//       </PaginationContent>
//     </PaginationRoot>
//   );
// }

// Export individual components if needed for custom implementations
// export {
//   PaginationRoot,
//   PaginationContent,
//   PaginationLink,
//   PaginationItem,
//   PaginationPrevious,
//   PaginationNext,
//   PaginationEllipsis,
// };

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/utils/index";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  paginationVariants,
  paginationContentVariants,
  paginationPreviousVariants,
  paginationNextVariants,
  paginationEllipsisVariants,
} from "./variants";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn(paginationVariants(), className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(paginationContentVariants(), className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

export type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn(paginationPreviousVariants(), className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn(paginationNextVariants(), className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(paginationEllipsisVariants(), className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
