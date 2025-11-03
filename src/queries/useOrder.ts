import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api.client";
import type {
  AddPaymentDto,
  AddProductDto,
  AssignClientDto,
  OrderType,
} from "../pages/home/types";

// 🧭 GET: Barcha buyurtmalar
export const useGetAllOrders = (options?: { enabled?: boolean }) => {
  return useQuery<OrderType[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/order/get-all-orders");
      return data.data;
    },
    enabled: options?.enabled ?? true,
  });
};

// 🧭 GET: Bitta buyurtma ID orqali olish
export const useGetOrderById = (orderId: string | undefined) => {
  return useQuery<OrderType>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data } = await api.get(`/order/get-order-details/${orderId}`);
      return data;
    },
    enabled: !!orderId,
  });
};

// 🧩 POST: Yangi buyurtma yaratish
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { order_generated_id: string }) => {
      const { data } = await api.post("/order/create-new-order", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Create order error:", error);
    },
  });
};

// 🧨 DELETE: Buyurtmani o‘chirish
export const useDeleteOrderById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.delete(`/order/delete-order-by-id/${orderId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Delete order error:", error);
    },
  });
};

// 👤 PATCH: Buyurtmaga mijoz biriktirish
export const useAssignClientToOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { orderId: string; data: AssignClientDto }) => {
      const { orderId, data: payload } = params;
      const { data } = await api.patch(
        `/order/assign-client/${orderId}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Assign client error:", error);
    },
  });
};

// 🛒 POST: Buyurtmaga mahsulot qo‘shish
export const useAddProductToOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { orderId: string; data: AddProductDto }) => {
      const { orderId, data: payload } = params;
      const { data } = await api.post(
        `/order/add-product-to-order/${orderId}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Add product error:", error);
    },
  });
};

// ❌ DELETE: Buyurtmadan mahsulotni o‘chirish
export const useDeleteProductFromOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { orderId: string; productId: string }) => {
      const { orderId, productId } = params;
      const { data } = await api.delete(
        `/order/delete-product-from-order/${orderId}/${productId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Delete product error:", error);
    },
  });
};

// 💵 POST: Buyurtmadagi mahsulotga to‘lov qo‘shish
export const useAddPaymentToOrderProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      orderId: string;
      productId: string;
      paymentId: string;
      data: AddPaymentDto;
    }) => {
      const { orderId, productId, paymentId, data: payload } = params;
      const { data } = await api.post(
        `/order/add-payment-to-order/${orderId}/${productId}/${paymentId}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Add payment error:", error);
    },
  });
};

// 💳 PATCH: Buyurtmadagi mahsulot to‘lovini yangilash
export const useUpdatePaymentOfOrderProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      orderId: string;
      productId: string;
      paymentId: string;
      data: AddPaymentDto;
    }) => {
      const { orderId, productId, paymentId, data: payload } = params;
      const { data } = await api.patch(
        `/order/update-payment-details/${orderId}/${productId}/${paymentId}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Update payment error:", error);
    },
  });
};

// ✅ PATCH: Buyurtmani yakunlangan holatga o‘tkazish
export const useSetOrderStatusToFinished = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.patch(
        `/order/set-status-order-to-finish/${orderId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Set status to finished error:", error);
    },
  });
};

// 🚫 PATCH: Buyurtmani bekor qilingan holatga o‘tkazish
export const useSetOrderStatusToCanceled = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.patch(
        `/order/set-status-order-to-cancel/${orderId}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Set status to canceled error:", error);
    },
  });
};
