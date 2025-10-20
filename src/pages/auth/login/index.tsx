import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginFormData {
  credential: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const validateCredential = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;

    if (emailRegex.test(value) || phoneRegex.test(value)) {
      return true;
    }
    return "Email yoki telefon raqam kiriting";
  };

  const onSubmit = (data: LoginFormData) => {
    console.log("Login ma'lumotlari:", data);
    localStorage.setItem("token", "abc");
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Xush kelibsiz
          </h1>
          <p className="text-gray-600">Davom etish uchun tizimga kiring</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-300">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email yoki Telefon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="flex gap-1">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <input
                  {...register("credential", {
                    required: "Bu maydon majburiy",
                    validate: validateCredential,
                  })}
                  type="text"
                  placeholder="login"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${
                    errors.credential ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.credential && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">⚠</span>{" "}
                  {errors.credential.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parol
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...register("password", {
                    required: "Parol majburiy",
                    minLength: {
                      value: 8,
                      message:
                        "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">⚠</span>{" "}
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Kirish
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Kirish orqali siz{" "}
          <button className="text-blue-600 hover:underline">
            Foydalanish shartlari
          </button>{" "}
          va{" "}
          <button className="text-blue-600 hover:underline">
            Maxfiylik siyosati
          </button>
          ga rozilik bildirasiz
        </p>
      </div>
    </div>
  );
}
