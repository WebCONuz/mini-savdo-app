import Avatar from "../../../components/avatar";
import Drawer from "../../../components/drawer";
import { Edit } from "lucide-react";
import type { ClientType } from "../types";
import { useGetAllClients } from "../../../queries/useClients";
import { Button } from "@mui/material";

const ClientsListDrawer = ({
  isOpen,
  onClose,
  openEdit,
  openCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  openEdit: (a: ClientType) => void;
  openCreate: (a: boolean) => void;
}) => {
  const { data: clients, isLoading } = useGetAllClients({
    enabled: isOpen,
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="500px"
      position="right"
      title="Добавить клиента"
    >
      {isLoading ? (
        <div className="bg-gray-50 text-gray-500 rounded-md text-center py-20">
          Загрузка ...
        </div>
      ) : clients && clients.length === 0 ? (
        <div className="flex flex-col items-center py-10 gap-y-3 bg-gray-50 rounded-md">
          <span className="text-gray-500">Нет доступных клиентов</span>
          <Button
            variant="contained"
            onClick={() => openCreate(true)}
            sx={{
              backgroundColor: "#3b82f6",
              "&:hover": { backgroundColor: "#2563eb" },
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              py: 0.7,
            }}
          >
            Новый клиент
          </Button>
        </div>
      ) : (
        <>
          {clients &&
            clients.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border border-gray-300 rounded-lg mb-2 py-2 px-3"
              >
                <Avatar
                  fullName={`${item.client_name} ${item.client_surname}`}
                  color="#10B981"
                />
                <div className="flex gap-x-3">
                  <Edit
                    size={18}
                    color="#0D6EFD"
                    className="cursor-pointer"
                    onClick={() => openEdit(item)}
                  />
                </div>
              </div>
            ))}
          <div className="flex justify-end">
            <Button
              variant="contained"
              onClick={() => openCreate(true)}
              sx={{
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
                textTransform: "none",
                fontWeight: 600,
                px: 2,
                py: 0.7,
              }}
            >
              Новый клиент
            </Button>
          </div>
        </>
      )}
    </Drawer>
  );
};

export default ClientsListDrawer;
