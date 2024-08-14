"use client"

import { ColumnDef, FilterFn } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { VoterSchema } from "../data/voterschema"
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

const includesBoolean: FilterFn<any> = (row, columnId, filterValue) => {
  // Check if filterValue is an array
  if (Array.isArray(filterValue)) {
    // Get the value of the column for the current row
    const rowValue = row.getValue(columnId);
    // Return true if the rowValue is included in the filterValue array
    return filterValue.includes(rowValue);
  }
  // If filterValue is not an array, return true (no filtering)
  return true;
};

export default includesBoolean;

export const columns: ColumnDef<VoterSchema>[] = [
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
    accessorKey: "voter_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("voter_id")}</div>,
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
    accessorKey: "verified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verified" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("verified") ? "Yes" : "No"}
      </span>
    ),
  },
  {
    accessorKey: "present",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Present" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("present") ? "Yes" : "No"}
      </span>
    ),
    filterFn: includesBoolean,
  },
  {
    accessorKey: "voted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Voted" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("voted") ? "Yes" : "No"}
      </span>
    ),
        filterFn: includesBoolean,

  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]