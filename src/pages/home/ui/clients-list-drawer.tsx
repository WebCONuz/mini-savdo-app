import Avatar from "../../../components/avatar";
import Drawer from "../../../components/drawer";
import { Edit, Trash } from "lucide-react";
import { clientsData } from "../data";
import type { ClientType } from "../types";

const ClientsListDrawer = ({
  isOpen,
  onClose,
  openEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  openEdit: (a: ClientType) => void;
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="500px"
      position="right"
      title="Добавить клиента"
    >
      {clientsData.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between border border-gray-300 rounded-lg mb-2 py-2 px-3"
        >
          <Avatar
            fullName={`${item.first_name} ${item.last_name}`}
            color="#10B981"
          />
          <div className="flex gap-x-3">
            <Edit
              size={18}
              color="#0D6EFD"
              className="cursor-pointer"
              onClick={() => openEdit(item)}
            />
            <Trash size={18} color="#DC3545" className="cursor-pointer" />
          </div>
        </div>
      ))}
    </Drawer>
  );
};

export default ClientsListDrawer;
