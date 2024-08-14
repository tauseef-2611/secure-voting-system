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

 export default function DataTableDemo() {

const [dialogVisible, setDialogVisible] = useState(false);
const [selectedCandidate, setSelectedCandidate] = useState<Candidate>();
const handleViewDetails = (candidate: Candidate) => {
  setSelectedCandidate(candidate);
  setDialogVisible(true);
};
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
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey:"date_of_birth",
    header:"Date of Birth",
  },
  {
    accessorKey: "year_of_membership",
    header: "Year Of Membership",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "area",
    header: "Area",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const candidate = row.original;


      return (
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={()=>handleViewDetails(candidate)}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
      )
    },
  },
]




  const handleCloseDialog = () => {
    setDialogVisible(false);
    setSelectedCandidate(undefined);
  };

    const [data, setData] = React.useState<Candidate[]>([])
    React.useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get('/api/getCandidates');
              setData(response.data);
            //   alert('Data fetched successfully');
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
    phone: false,
    date_of_birth: false,
    year_of_membership: false,
    area:true,
    unit:true,
    // year_of_membership: false,
    // phone: true,
  };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const MAX_SELECTIONS = 5; // Maximum number of rows that can be selected

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updaterOrValue) => {
    const newRowSelection = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection) : updaterOrValue;
    const selectedRowCount = Object.values(newRowSelection).filter(Boolean).length;
    if (selectedRowCount <= MAX_SELECTIONS) {
      setRowSelection(newRowSelection);
    } else {
      alert(`You can only select up to ${MAX_SELECTIONS} rows.`);
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
    onRowSelectionChange: setRowSelection,
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
    console.log('Selected Rows:', selectedRows);
    const _ids = selectedRows.map(row => row.original._id);
    setVoteids(_ids);
    console.log('Vote IDs:', _ids);
  }, [table.getSelectedRowModel().rows]);
  const handleVote = async () => {
    console.log('Voting for:', voteids);
    try {
      const response = await axios.post('/api/voteCandidate', { candidateVotes: voteids });
      console.log(response);
    } catch (error) {
      console.error('Voting failed:', error
      );
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
      {dialogVisible && selectedCandidate && (
        <Dialog open={dialogVisible} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogClose />
              <DialogTitle>Candidate Information</DialogTitle>
            </DialogHeader>
            <DialogDescription>
  <div style={{ marginBottom: '1rem' }}>
    Details of the selected candidate.
  </div>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <p><span className="bold">Name:</span> {selectedCandidate.name}</p>
    <p><span className="bold">Date Of Birth:</span> {selectedCandidate.date_of_birth}</p>
    <p><span className="bold">Year Of Membership:</span> {selectedCandidate.year_of_membership}</p>
    <p><span className="bold">Phone:</span> {selectedCandidate.phone}</p>
  </div>
</DialogDescription>
          </DialogContent>
        </Dialog>
      )}
        <Input
          placeholder="Search Names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
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
      <div className="flex items-center justify-center space-x-2 py-4">
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

