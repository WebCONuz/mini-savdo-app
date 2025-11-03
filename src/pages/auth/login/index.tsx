import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../../queries/useLogin";
import { useAuthStore } from "../../../store/auth.store";

interface LoginFormData {
  credential: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate: login, isPending, error } = useLogin();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const validateCredential = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (emailRegex.test(value) || phoneRegex.test(value)) return true;
    return "Введите адрес электронной почты или номер телефона";
  };

  const onSubmit = (data: LoginFormData) => {
    login({
      login: data.credential,
      password: data.password,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Заголовок */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Добро пожаловать
          </h1>
          <p className="text-gray-600">Войдите в систему, чтобы продолжить</p>
        </div>

        {/* Форма входа */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-300">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Поле логина */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email или Телефон
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  {...register("credential", {
                    required: "Это поле обязательно для заполнения",
                    validate: validateCredential,
                  })}
                  type="text"
                  placeholder="Введите email или телефон"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all ${
                    errors.credential ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.credential && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  ⚠ {errors.credential.message}
                </p>
              )}
            </div>

            {/* Поле пароля */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  {...register("password", {
                    required: "Пароль обязателен для заполнения",
                    minLength: {
                      value: 8,
                      message: "Пароль должен содержать минимум 8 символов",
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
                  ⚠ {errors.password.message}
                </p>
              )}
            </div>

            {/* Ошибка при авторизации */}
            {error && (
              <p className="text-red-500 text-center text-sm">
                {error.message}
              </p>
            )}

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                isPending ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>

        {/* Политика и условия */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Входя в систему, вы соглашаетесь с{" "}
          <button className="text-blue-600 hover:underline">
            Условиями использования
          </button>{" "}
          и{" "}
          <button className="text-blue-600 hover:underline">
            Политикой конфиденциальности
          </button>
        </p>
      </div>
    </div>
  );
}
