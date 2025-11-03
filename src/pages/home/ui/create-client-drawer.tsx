import { useForm } from "react-hook-form";
import { User, Phone } from "lucide-react";
import Drawer from "../../../components/drawer";
import type { ClientType } from "../types";
import { useEffect } from "react";
import { useCreateClient, useUpdateClient } from "../../../queries/useClients";

interface ClientFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const CreateClientDrawer = ({
  isOpen,
  onClose,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  initial: ClientType | null;
}) => {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>();

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (phoneRegex.test(value)) return true;
    return "Введите корректный номер телефона";
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (initial) {
        await updateClient.mutateAsync({
          clientId: initial._id || "",
          data: {
            _id: initial._id,
            client_name: data.firstName,
            client_surname: data.lastName,
            client_phone_number: data.phoneNumber,
          },
        });
      } else {
        await createClient.mutateAsync({
          client_name: data.firstName,
          client_surname: data.lastName,
          client_phone_number: data.phoneNumber,
        });
      }

      reset();
      onClose();
    } catch (err) {
      console.error("Ошибка:", err);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (initial) {
      reset({
        firstName: initial.client_name || "",
        lastName: initial.client_surname || "",
        phoneNumber: initial.client_phone_number || "",
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        phoneNumber: "",
      });
    }
  }, [initial, reset]);

  const isLoading = createClient.isPending || updateClient.isPending;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      width="500px"
      position="right"
      title={initial ? "Редактировать клиента" : "Добавить клиента"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-[calc(100vh-89px)]"
      >
        <div className="space-y-4">
          {/* Имя */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                {...register("firstName", {
                  required: "Имя обязательно для заполнения",
                  minLength: {
                    value: 2,
                    message: "Имя должно содержать минимум 2 символа",
                  },
                  pattern: {
                    value: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                    message: "Можно использовать только буквы",
                  },
                })}
                type="text"
                placeholder="Введите имя"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${
                  errors.firstName ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="font-medium">⚠</span>{" "}
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Фамилия */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Фамилия
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                {...register("lastName", {
                  required: "Фамилия обязательна для заполнения",
                  minLength: {
                    value: 2,
                    message: "Фамилия должна содержать минимум 2 символа",
                  },
                  pattern: {
                    value: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                    message: "Можно использовать только буквы",
                  },
                })}
                type="text"
                placeholder="Введите фамилию"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${
                  errors.lastName ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            {errors.lastName && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="font-medium">⚠</span> {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Номер телефона */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер телефона
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                {...register("phoneNumber", {
                  required: "Номер телефона обязателен для заполнения",
                  validate: validatePhoneNumber,
                  minLength: {
                    value: 9,
                    message: "Номер телефона должен содержать минимум 9 цифр",
                  },
                })}
                type="text"
                placeholder="+998 90 123 45 67"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span className="font-medium">⚠</span>{" "}
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold transition-all ${
            isLoading
              ? "opacity-60 cursor-not-allowed"
              : "hover:from-blue-700 hover:to-indigo-700"
          }`}
        >
          {isLoading ? "Сохранение..." : initial ? "Сохранить" : "Добавить"}
        </button>
      </form>
    </Drawer>
  );
};

export default CreateClientDrawer;
