"use client";

import * as React from "react";
import Link from "next/link";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  GripVerticalIcon,
  EllipsisVerticalIcon,
  Columns3Icon,
  ChevronDownIcon,
  PlusIcon,
  ChevronsLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  NavigationIcon,
  TruckIcon,
  ReceiptIcon,
  Loader2Icon,
  ArrowUpRightIcon,
} from "lucide-react";

// Schema for Trip Telematics Table
export const tripRowSchema = z.object({
  id: z.string(),
  tripNumber: z.string(),
  title: z.string(),
  originName: z.string().optional().nullable(),
  destinationName: z.string().optional().nullable(),
  vehicleReg: z.string().optional().nullable(),
  driverName: z.string().optional().nullable(),
  estimatedDistanceKm: z.string().optional().nullable(),
  status: z.string(),
});

type TripRowData = z.infer<typeof tripRowSchema>;

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <GripVerticalIcon className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const tripColumns: ColumnDef<TripRowData>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tripNumber",
    header: "Trip Number",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-primary">
        {row.original.tripNumber}
      </span>
    ),
  },
  {
    accessorKey: "title",
    header: "Title & Route",
    cell: ({ row }) => (
      <div>
        <div className="font-semibold text-xs text-foreground">{row.original.title}</div>
        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
          <NavigationIcon className="size-3 text-muted-foreground" />
          {row.original.originName || "Origin"} &rarr; {row.original.destinationName || "Destination"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "vehicleReg",
    header: "Assigned Vehicle",
    cell: ({ row }) => (
      <span className="text-xs font-medium">{row.original.vehicleReg || "Unassigned"}</span>
    ),
  },
  {
    accessorKey: "driverName",
    header: "Assigned Driver",
    cell: ({ row }) => (
      <span className="text-xs font-medium">{row.original.driverName || "Unassigned"}</span>
    ),
  },
  {
    accessorKey: "estimatedDistanceKm",
    header: "Est. Distance",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.estimatedDistanceKm ? `${row.original.estimatedDistanceKm} km` : "—"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={
            status === "IN_PROGRESS"
              ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 text-[10px]"
              : status === "COMPLETED"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px]"
              : status === "ASSIGNED"
              ? "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 text-[10px]"
              : "text-[10px]"
          }
          variant="outline"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="flex size-8 text-muted-foreground data-open:bg-muted"
              size="icon"
            />
          }
        >
          <EllipsisVerticalIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 text-xs">
          <DropdownMenuItem>
            <Link href={`/dashboard/trips`} className="flex items-center gap-1.5 w-full">
              <ArrowUpRightIcon className="size-3.5" /> View Details
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function DraggableRow({ row }: { row: Row<TripRowData> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 text-xs hover:bg-muted/40"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({ data: initialData }: { data?: any }) {
  const [tripsData, setTripsData] = React.useState<TripRowData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const fetchLiveTrips = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/trips");
      const data = await res.json();
      const rows: TripRowData[] = (data.trips || []).map((t: any) => ({
        id: t.id,
        tripNumber: t.tripNumber,
        title: t.title,
        originName: t.originName,
        destinationName: t.destinationName,
        vehicleReg: t.vehicle ? t.vehicle.registrationNumber : null,
        driverName: t.driver ? t.driver.fullName : null,
        estimatedDistanceKm: t.estimatedDistanceKm,
        status: t.status,
      }));

      // Fallback baseline rows if database has sparse records
      if (rows.length === 0) {
        setTripsData([
          {
            id: "1",
            tripNumber: "TRIP-10492",
            title: "Express Freight - Route A4",
            originName: "Central Logistics Hub",
            destinationName: "North Port Terminal",
            vehicleReg: "TRK-104",
            driverName: "John Doe",
            estimatedDistanceKm: "240",
            status: "IN_PROGRESS",
          },
          {
            id: "2",
            tripNumber: "TRIP-10493",
            title: "Cold Chain Supply - Dairy",
            originName: "South Distribution Ctr",
            destinationName: "East Metro Superstore",
            vehicleReg: "VAN-089",
            driverName: "Sarah Connor",
            estimatedDistanceKm: "115",
            status: "ASSIGNED",
          },
          {
            id: "3",
            tripNumber: "TRIP-10494",
            title: "Heavy Equipment Transport",
            originName: "Quarry Depot #3",
            destinationName: "Industrial Zone B",
            vehicleReg: "TRK-902",
            driverName: "Mike Johnson",
            estimatedDistanceKm: "320",
            status: "COMPLETED",
          },
        ]);
      } else {
        setTripsData(rows);
      }
    } catch {
      toast.error("Failed to load live telematics trips table.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLiveTrips();
  }, [fetchLiveTrips]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => tripsData?.map(({ id }) => id) || [],
    [tripsData]
  );

  const table = useReactTable({
    data: tripsData,
    columns: tripColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setTripsData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs defaultValue="active-trips" className="w-full flex-col justify-start gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
        <TabsList className="**:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1">
          <TabsTrigger value="active-trips" className="gap-1.5 text-xs">
            <NavigationIcon className="size-3.5 text-primary" /> Active Trips & Routes
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Search trip, vehicle, driver..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 w-48 text-xs"
          />

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8 gap-1 text-xs" />}>
              <Columns3Icon className="size-3.5" />
              Columns
              <ChevronDownIcon className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 text-xs">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-xs"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="h-8 gap-1 text-xs font-semibold">
            <Link href="/dashboard/trips" className="flex items-center gap-1">
              <PlusIcon className="size-3.5" /> New Trip
            </Link>
          </Button>
        </div>
      </div>

      <TabsContent value="active-trips" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-xs text-muted-foreground gap-2">
              <Loader2Icon className="size-4 animate-spin" /> Loading telematics table...
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted/50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan} className="text-xs font-bold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={tripColumns.length} className="h-24 text-center text-xs text-muted-foreground">
                        No active trips found in telematics feed.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          )}
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between px-2 text-xs">
          <div className="hidden text-muted-foreground sm:block">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">Rows per page</span>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-16 h-7 text-xs">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  <SelectGroup>
                    {[5, 10, 20, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`} className="text-xs">
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                className="h-7 w-7"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronsLeftIcon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-xs"
                className="h-7 w-7"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-xs"
                className="h-7 w-7"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon-xs"
                className="h-7 w-7"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronsRightIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
