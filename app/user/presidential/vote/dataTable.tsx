"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  OnChangeFn,
  RowSelectionState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogCancel,
AlertDialogAction } from "@/components/ui/alert-dialog"
import { Dialog
  , DialogContent
  , DialogHeader
  , DialogTitle
  , DialogClose,
  DialogTrigger,
  DialogDescription
 } from "@/components/ui/dialog"
import { DataTablePagination } from "./data-table-pagination"
import { Election } from "@/utils/Types/election"
import { doLogout } from "@/app/actions"
import { User } from "@/utils/Types/user"
import { DataTableToolbar } from "./data-table-toolbar"
import { FilterFn } from "@tanstack/react-table"
import { toast } from "sonner"
import Loading from "@/app/loading"

interface HeaderProps {
  election: Election | null;
  user: User | null;
}
export default function DataTableDemo({ election, user }: HeaderProps) {
const [loading , setLoading] = useState(true);
type Candidate = {
    _id: string;
    candidate_id: string;
    name: string;
    phone: string;
    year_of_membership: number;
    date_of_birth: string;
    unit: string;
    area: string;
  };
  const includesString: FilterFn<any> = (row: { getValue: (arg0: any) => any }, columnId: any, filterValue: { some: (arg0: (value: any) => any) => any; toLowerCase: () => any }) => {
    const rowValue = row.getValue(columnId);
    if (Array.isArray(filterValue)) {
      return filterValue.some((value) =>
        rowValue.toLowerCase().includes(value.toLowerCase())
      );
    }
    return rowValue.toLowerCase().includes(filterValue.toLowerCase());
  };
const columns: ColumnDef<Candidate>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "candidate_id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "area",
    header: "Area",
    filterFn: includesString,
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
]




    const [data, setData] = React.useState<Candidate[]>([])
    React.useEffect(() => {
      console.log('Election:', election);
        const fetchData = async () => {
            try {
              const response = await axios.get('/api/getCandidates');
              const filteredData = response.data.filter((candidate: Candidate) => candidate.candidate_id !== user?.voter_id);
              setData(filteredData);
              setLoading(false);
            } catch (error: unknown) {
              if (error instanceof Error) {
                alert('Error fetching data: ' + error.message);
              } else {
                alert('An unknown error occurred');
              }
            }
          };
      
          fetchData();

      }, [])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const initialColumnVisibility = {
    name: true,
    area:true,
    unit:true,
    phone:false,
  };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const MAX_SELECTIONS = election?.nominee_size??1; // Maximum number of rows that can be selected

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    const newRowSelection = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
    const selectedRowCount = Object.values(newRowSelection).filter(Boolean).length;
    if (selectedRowCount <= MAX_SELECTIONS) {
      setRowSelection(newRowSelection);
    } else {
      toast.error(`Please select ${MAX_SELECTIONS} candidates`);
    }
  };
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  const [voteids, setVoteids] = React.useState<string[]>([]);
  React.useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows;
    const _ids = selectedRows.map(row => row.original._id);
    setVoteids(_ids);
  }, [table.getSelectedRowModel().rows]);
  const handleVote = async () => {
    console.log('Voting for:', voteids);
    if(voteids.length < MAX_SELECTIONS) {
      toast.error(`Please select ${MAX_SELECTIONS} candidates`);
      return;
    }
    try {
      const response = await axios.post(`/api/vote/${user?.voter_id}`, { candidateVotes: voteids });
      await doLogout();
      alert('Voting successful');
      window.location.href = '/';
    } catch (error) {
      toast.error('Error voting: ' + error);
    }
  }

  if(loading) {
    return <Loading />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
      <DataTableToolbar table={table} />
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              View <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">

      <DataTablePagination table={table} />
      </div>
      <div className="flex items-center justify-around space-x-2 py-4 px-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button onClick={() => console.log(table.getSelectedRowModel().rows)}>
      Vote
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        {table.getSelectedRowModel().rows.map((row) => (
          <p key={row.id}>
  {`ID: ${row.original.candidate_id}, Area: ${row.original.area}, Name: ${
    typeof row.original.name === 'object' 
      ? JSON.stringify(row.original.name) 
      : row.original.name
  }`}
</p>
        ))}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>

      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>handleVote()}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

      </div>
    </div>
  )
}

