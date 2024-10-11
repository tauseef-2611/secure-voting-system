"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import React, { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

interface Area {
  id: string
  name: string
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [areaOptions, setAreaOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
        try {
            const response = await fetch("/api/voter-areas");
            const data = await response.json();
            // console.log("Fetched data:", data); // Log the fetched data to verify its structure
            const mappedAreas = data.map((area: string) => ({
                label: area,
                value: area,
            }));
            setAreaOptions(mappedAreas);
            // console.log("Areas fetched and mapped successfully");
            // console.log(mappedAreas);
        } catch (error) {
            console.error("Error fetching areas:", error);
        }
    };

    fetchAreas();
}, []);

  const isFiltered = table.getState().columnFilters.length > 0
  console.log(table.getState().columnFilters)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
          {table.getColumn("area") && areaOptions.length > 0 && (
            <DataTableFacetedFilter
              column={table.getColumn("area")}
              title="Area"
              options={areaOptions}
            />
          )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

    </div>
  )
}