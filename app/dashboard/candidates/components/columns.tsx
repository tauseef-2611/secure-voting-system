"use client"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterFn } from "@tanstack/react-table"
import { CandidateSchema } from "../data/candidateschema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

const includesString: FilterFn<any> = (row: { getValue: (arg0: any) => any }, columnId: any, filterValue: { some: (arg0: (value: any) => any) => any; toLowerCase: () => any }) => {
  const rowValue = row.getValue(columnId);
  if (Array.isArray(filterValue)) {
    return filterValue.some((value) =>
      rowValue.toLowerCase().includes(value.toLowerCase())
    );
  }
  return rowValue.toLowerCase().includes(filterValue.toLowerCase());
};

const voteFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const vote = row.getValue(columnId);

  if (typeof vote !== 'number') {
    return false;
  }

  switch (filterValue) {
    case 5:
      return vote > 5;
    case 10:
      return vote > 10;
    case 15:
      return vote > 15;
    case 20:
      return vote > 20;
    case 25:
      return vote > 25;
    case 30:
      return vote > 30;
    case 40:
      return vote > 40;
    case 50:
      return vote > 50;
    default:
      return true;
  }
};
export const columns: ColumnDef<CandidateSchema>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "candidate_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("candidate_id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("phone")}
      </span>
    ),
  },
  // {
  //   accessorKey: "year_of_membership",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Year of Membership" />
  //   ),
  //   cell: ({ row }) => (
  //     <span className="max-w-[500px] truncate font-medium">
  //       {row.getValue("year_of_membership")}
  //     </span>
  //   ),
  // },
  {
    accessorKey: "date_of_birth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("date_of_birth")}
      </span>
    ),
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("unit")}
      </span>
    ),
  },
  {
    accessorKey: "area",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Area" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("area")}
      </span>
    ),
    filterFn: includesString,
  },
  {
    accessorKey: "votes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Votes" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("votes")}
      </span>
    ),
    filterFn: voteFilterFn,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
