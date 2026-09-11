import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/db";

export const statusLabel: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  packed: "Đã đóng gói",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã huỷ",
  returned: "Hoàn trả",
};

export const statusTone: Record<OrderStatus, string> = {
  pending: "bg-tint-yellow",
  confirmed: "bg-tint-blue",
  packed: "bg-tint-purple",
  shipping: "bg-tint-peach",
  delivered: "bg-tint-green",
  cancelled: "bg-tint-pink",
  returned: "bg-tint-pink",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  cod: "COD",
  bank: "Chuyển khoản",
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  unpaid: "Chưa thu",
  paid: "Đã thu",
  refunded: "Đã hoàn",
};

/** Allowed next statuses from a given status (owner workflow). */
export const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["shipping", "cancelled"],
  shipping: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

export const statusActionLabel: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Xác nhận đơn",
  packed: "Đã đóng gói (trừ kho)",
  shipping: "Đã giao cho vận chuyển",
  delivered: "Đã giao thành công",
  cancelled: "Huỷ đơn",
  returned: "Khách hoàn trả",
};

export function vnd(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n);
}

export function dateTime(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(
    new Date(iso),
  );
}
