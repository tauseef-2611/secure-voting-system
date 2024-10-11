"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerDemoProps {
  onDateChange?: (date: Date) => void;
}

export function DatePickerDemo({ onDateChange }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [inputValue, setInputValue] = React.useState<string>("");

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setInputValue(format(selectedDate, "dd-MM-yyyy"));
      if (onDateChange) {
        onDateChange(selectedDate);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length > 2) value = value.slice(0, 2) + "-" + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + "-" + value.slice(5);
    setInputValue(value);
    if (value.length === 10) {
      const parsedDate = parse(value, "dd-MM-yyyy", new Date());
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        if (onDateChange) {
          onDateChange(parsedDate);
        }
      }
    }
  };

  return (
    <Popover>
      <Button
        variant={"outline"}
        className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="dd-mm-yyyy"
          className="border-none outline-none bg-transparent flex-grow"
        />
        <PopoverTrigger asChild>
          <div className="py-2">
            <CalendarIcon className="h-4 w-4" />
          </div>
        </PopoverTrigger>
      </Button>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          onSelect={handleDateSelect}
          fromYear={1960}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  )
}