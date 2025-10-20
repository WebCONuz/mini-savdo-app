export type Sale = {
  _id: string;
  saleId: string;
  model: string;
  client: string;
  totalAmount: number;
  prepayment: number;
  createdDate: string;
  startDate: string;
  endDate: string;
  status: "Активный" | "Завершен" | "Ожидание" | "Отменен";
};

export type ClientType = {
  _id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

export type SaleItem = {
  id: string;
  name: string;
  total: number;
  prepayment: number;
  startDate: string;
  endDate: string;
};
