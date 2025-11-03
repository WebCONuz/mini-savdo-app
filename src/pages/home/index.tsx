import { useMemo, useState } from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { formatCurrency, generateUniqueId } from "../../functions";
import type { ClientType, OrderType } from "./types";
import Container from "../../components/container";
import DetailsDrawer from "./ui/details-drawer";
import { Box, Button } from "@mui/material";
import { FileSpreadsheet } from "lucide-react";
import CreateClientDrawer from "./ui/create-client-drawer";
import ClientsListDrawer from "./ui/clients-list-drawer";
import { useAuthStore } from "../../store/auth.store";
import { useCreateOrder, useGetAllOrders } from "../../queries/useOrder";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Активный":
      return "bg-green-100 text-green-800 border-green-200";
    case "Завершен":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Ожидание":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Отменен":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function SalesTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateClient, setIsCreateClient] = useState(false);
  const [initial, setInitial] = useState<ClientType | null>(null);
  const [isListClient, setIsListClient] = useState(false);
  const [saleId, setSaleId] = useState("");

  const { logout } = useAuthStore();
  const { data: orders, isLoading } = useGetAllOrders();
  const createOrder = useCreateOrder();

  const handleRowClick = (id: string) => {
    setIsOpen(true);
    setSaleId(id);
  };

  const handleNewSale = async () => {
    const order_generated_id = generateUniqueId();
    await createOrder.mutateAsync({ order_generated_id });
    console.log("Новая продажа clicked");
  };

  const columns = useMemo<MRT_ColumnDef<OrderType>[]>(
    () => [
      {
        accessorKey: "_id",
        header: "№",
        size: 60,
        grow: false,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <div
            className="font-medium text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
            onClick={() => handleRowClick(row.original._id)}
          >
            {row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: "order_generated_id",
        header: "ID Заказа",
        size: 140,
        grow: false,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <div
            className="font-mono text-sm text-blue-600 font-semibold cursor-pointer hover:text-blue-800 hover:underline"
            onClick={() => handleRowClick(cell.row.original._id)}
          >
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        accessorFn: (row) =>
          `${row.order_assigned_client?.client_name || ""} ${
            row.order_assigned_client?.client_surname || ""
          }`.trim() || "Не назначен",
        header: "Клиент",
        size: 180,
        grow: true,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <div className="font-medium text-gray-700">
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        accessorFn: (row) =>
          row.order_products.reduce((sum, p) => sum + p.product_full_amount, 0),
        header: "Общая Сумма",
        size: 160,
        grow: false,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <div className="font-semibold text-gray-900">
            {formatCurrency(cell.getValue<number>())}
          </div>
        ),
      },
      {
        accessorFn: (row) =>
          row.order_products.reduce(
            (sum, p) => sum + p.product_pre_paid_amount,
            0
          ),
        header: "Предоплата",
        size: 160,
        grow: false,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <div className="font-medium text-green-700">
            {formatCurrency(cell.getValue<number>())}
          </div>
        ),
      },
      {
        accessorKey: "order_created_date",
        header: "Дата создания",
        size: 140,
        grow: false,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ cell }) => (
          <div className="text-sm text-gray-600">
            {new Date(cell.getValue<string>()).toLocaleDateString("ru-RU")}
          </div>
        ),
      },
      {
        accessorKey: "order_status",
        header: "Статус",
        size: 140,
        grow: false,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const displayStatus =
            status === "process"
              ? "Активный"
              : status === "finished"
              ? "Завершен"
              : status === "finished"
              ? "Отменен"
              : "Ожидание";
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                displayStatus
              )}`}
            >
              {displayStatus}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <Container>
        <div className="py-4">
          {isLoading ? (
            <div className="w-full h-[50vh] bg-gray-100 flex items-center justify-center rounded-md text-gray-500">
              <span>Загрузка ...</span>
            </div>
          ) : orders?.length === 0 ? (
            <div className="w-full h-[50vh] bg-gray-100 flex flex-col gap-y-2 items-center justify-center rounded-md text-gray-500">
              <span>Заказов нет!</span>
              <Button
                variant="contained"
                onClick={handleNewSale}
                sx={{
                  backgroundColor: "#3b82f6",
                  "&:hover": { backgroundColor: "#2563eb" },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2,
                  py: 0.7,
                }}
              >
                Новая продажа
              </Button>
            </div>
          ) : orders && orders?.length > 0 ? (
            <div className="mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <MaterialReactTable
                  columns={columns}
                  data={orders}
                  enableColumnResizing={false}
                  enableStickyHeader
                  enablePagination={false}
                  enableRowNumbers={false}
                  enableColumnOrdering={false}
                  enableGlobalFilter={true}
                  enableFullScreenToggle={false}
                  enableDensityToggle={false}
                  enableColumnFilters={false}
                  enableColumnActions={false}
                  enableBottomToolbar={false}
                  enableSorting={false}
                  layoutMode="grid"
                  muiTableContainerProps={{
                    sx: { maxHeight: "calc(100vh - 32px)" },
                  }}
                  muiTableProps={{
                    sx: {
                      tableLayout: "fixed",
                      width: "100%",
                      "& .MuiTableCell-root": {
                        padding: "16px",
                      },
                    },
                  }}
                  muiTableHeadCellProps={{
                    sx: {
                      backgroundColor: "#f8fafc",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      color: "#1e293b",
                      borderBottom: "2px solid #e2e8f0",
                    },
                  }}
                  muiTableBodyCellProps={{
                    sx: {
                      borderBottom: "1px solid #f1f5f9",
                    },
                  }}
                  muiTablePaperProps={{
                    elevation: 0,
                    sx: {
                      borderRadius: "0",
                    },
                  }}
                  muiTopToolbarProps={{
                    sx: {
                      backgroundColor: "#ffffff",
                      borderBottom: "1px solid #e2e8f0",
                    },
                  }}
                  renderTopToolbarCustomActions={() => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FileSpreadsheet size={28} color="#303C42" />
                      <h1
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#1e293b",
                          margin: 0,
                        }}
                      >
                        SpecialSheets
                      </h1>
                    </Box>
                  )}
                  renderToolbarInternalActions={() => (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={handleNewSale}
                        sx={{
                          backgroundColor: "#3b82f6",
                          "&:hover": { backgroundColor: "#2563eb" },
                          textTransform: "none",
                          fontWeight: 600,
                          px: 2.5,
                          py: 1,
                        }}
                      >
                        Новая продажа
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setIsListClient(true)}
                        sx={{
                          borderColor: "#3b82f6",
                          color: "#3b82f6",
                          "&:hover": {
                            borderColor: "#2563eb",
                            backgroundColor: "#eff6ff",
                          },
                          textTransform: "none",
                          fontWeight: 600,
                          px: 2.5,
                          py: 1,
                        }}
                      >
                        Список клиентов
                      </Button>
                      <Button
                        variant="contained"
                        onClick={logout}
                        sx={{
                          backgroundColor: "#C60101",
                          "&:hover": { backgroundColor: "#B50000" },
                          textTransform: "none",
                          fontWeight: 600,
                          px: 2.5,
                          py: 1,
                        }}
                      >
                        Выйти
                      </Button>
                    </Box>
                  )}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Container>

      <DetailsDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        saleId={saleId}
      />

      <ClientsListDrawer
        isOpen={isListClient}
        onClose={() => {
          setIsListClient(false);
          setInitial(null);
        }}
        openEdit={(client: ClientType) => {
          setInitial(client);
          setIsCreateClient(true);
        }}
        openCreate={setIsCreateClient}
      />

      <CreateClientDrawer
        isOpen={isCreateClient}
        onClose={() => {
          setIsCreateClient(false);
          setInitial(null);
        }}
        initial={initial}
      />
    </>
  );
}
