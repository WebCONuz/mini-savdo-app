import { useForm } from "react-hook-form";
import { User, Phone } from "lucide-react";
import Drawer from "../../../components/drawer";
import type { ClientType } from "../types";
import { useEffect } from "react";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>();

  const validatePhoneNumber = (value: string) => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (phoneRegex.test(value)) {
      return true;
    }
    return "To'g'ri telefon raqam kiriting";
  };

  const onSubmit = (data: ClientFormData) => {
    console.log("Yangi mijoz ma'lumotlari:", data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (initial) {
      reset({
        firstName: initial.first_name || "",
        lastName: initial.last_name || "",
        phoneNumber: initial.phone_number || "",
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        phoneNumber: "",
      });
    }
  }, [initial, reset]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      width="500px"
      position="right"
      title={`${initial ? "Редактировать клиента" : "Добавить клиента"}`}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between h-[calc(100vh-89px)]"
      >
        <div className="space-y-4">
          {/* First Name */}
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
                  required: "Ism majburiy",
                  minLength: {
                    value: 2,
                    message: "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
                  },
                  pattern: {
                    value: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                    message: "Faqat harflar ishlatilishi mumkin",
                  },
                })}
                type="text"
                placeholder="Ismni kiriting"
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

          {/* Last Name */}
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
                  required: "Familiya majburiy",
                  minLength: {
                    value: 2,
                    message:
                      "Familiya kamida 2 ta belgidan iborat bo'lishi kerak",
                  },
                  pattern: {
                    value: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                    message: "Faqat harflar ishlatilishi mumkin",
                  },
                })}
                type="text"
                placeholder="Familiyani kiriting"
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

          {/* Phone Number */}
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
                  required: "Telefon raqam majburiy",
                  validate: validatePhoneNumber,
                  minLength: {
                    value: 9,
                    message:
                      "Telefon raqam kamida 9 ta raqamdan iborat bo'lishi kerak",
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          {initial ? "Сохранить" : "Добавить"}
        </button>
      </form>
    </Drawer>
  );
};

export default CreateClientDrawer;
