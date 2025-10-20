import Drawer from "../../../components/drawer";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import type { SaleItem } from "../types";
import { salesItemData } from "../data";

const DetailsDrawer = ({
  isOpen,
  onClose,
  saleId,
}: {
  isOpen: boolean;
  onClose: () => void;
  saleId: string;
}) => {
  const columns = useMemo<MRT_ColumnDef<SaleItem>[]>(
    () => [
      {
        id: "expander", // Accordion uchun checkbox
        header: "",
        enableColumnActions: false,
        enableSorting: false,
        enableColumnFilter: false,
        size: 50,
      },
      { accessorKey: "name", header: "Названия товара" },
      { accessorKey: "total", header: "Общая сумма" },
      { accessorKey: "prepayment", header: "Предоплата" },
      { accessorKey: "startDate", header: "Дата начало" },
      { accessorKey: "endDate", header: "Дата окончания" },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: salesItemData,
    enableTopToolbar: false, // 🔥 Search va toolbarni olib tashlaydi
    enableBottomToolbar: false, // footer yo‘q
    enablePagination: false, // pagination yo‘q
    enableTableFooter: false, // footer cells yo‘q
    enableSorting: false,
    enableColumnFilters: false,
    enableHiding: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,

    renderDetailPanel: ({ row }) => (
      <div className="p-4 text-gray-600 bg-gray-50 rounded-md">
        <p>
          <strong>{row.original.name}</strong> — Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Duis nec lorem a velit accumsan suscipit.
        </p>
      </div>
    ),
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="1400px"
      position="right"
      title={`Подробности продажи: ${saleId}`}
    >
      <MaterialReactTable table={table} />
    </Drawer>
  );
};

export default DetailsDrawer;
