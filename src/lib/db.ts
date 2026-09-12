import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const orderStatuses = [
  "pending",
  "confirmed",
  "packed",
  "shipping",
  "delivered",
  "cancelled",
  "returned",
] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const paymentMethods = ["cod", "bank"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const paymentStatuses = ["unpaid", "paid", "refunded"] as const;
export type PaymentStatus = (typeof paymentStatuses)[number];

export const movementReasons = ["purchase", "sale", "return", "adjust"] as const;
export type MovementReason = (typeof movementReasons)[number];

export function isOrderStatus(v: string): v is OrderStatus {
  return (orderStatuses as readonly string[]).includes(v);
}
export function isPaymentMethod(v: string): v is PaymentMethod {
  return (paymentMethods as readonly string[]).includes(v);
}
export function isPaymentStatus(v: string): v is PaymentStatus {
  return (paymentStatuses as readonly string[]).includes(v);
}

export type ProductRow = {
  slug: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
  source: "code" | "admin";
  compare_at_price: number | null;
  free_shipping: boolean | null;
  rating: number | null;
  sold: number | null;
  ages: string[] | null;
  colors: { id: string; name: string; hex: string }[] | null;
  art: string | null;
  tint: string | null;
  video_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductTranslationRow = {
  product_slug: string;
  locale: string;
  name: string | null;
  tagline: string | null;
  summary: string | null;
  audience: string | null;
  badge: string | null;
  age_label: string | null;
  highlights: string[] | null;
  features: { title: string; body: string }[] | null;
  specs: { label: string; value: string }[] | null;
  in_box: string[] | null;
  updated_at: string;
};

export type ProductMediaRow = {
  id: number;
  product_slug: string;
  kind: "image" | "video";
  url: string;
  storage_path: string | null;
  color: string | null;
  alt: string | null;
  sort_order: number;
  created_at: string;
};

export type VariantRow = {
  id: string;
  product_slug: string;
  color: string | null;
  color_name: string | null;
  sku: string;
  created_at: string;
};

export type OrderRow = {
  id: string;
  code: string;
  access_token: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string;
  note: string | null;
  admin_note: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  locale: string;
  transfer_reported_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: number;
  order_id: string;
  variant_id: string;
  product_slug: string;
  product_name: string;
  color: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type OrderEventRow = {
  id: number;
  order_id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  note: string | null;
  created_at: string;
};

export type PaymentRow = {
  id: string;
  order_id: string;
  provider: string;
  amount: number;
  status: PaymentStatus;
  provider_ref: string | null;
  paid_at: string;
  created_at: string;
};

export type BankTransactionRow = {
  id: number;
  provider: string;
  provider_tx_id: string;
  gateway: string | null;
  account_number: string | null;
  transfer_type: string;
  amount: number;
  content: string | null;
  reference_code: string | null;
  transaction_at: string | null;
  order_id: string | null;
  matched_at: string | null;
  created_at: string;
};

export type InventoryMovementRow = {
  id: number;
  variant_id: string;
  qty: number;
  reason: MovementReason;
  order_id: string | null;
  note: string | null;
  created_at: string;
};

export type VariantStockRow = {
  variant_id: string;
  product_slug: string;
  color: string | null;
  color_name: string | null;
  sku: string;
  product_name: string;
  category: string;
  price: number;
  active: boolean;
  on_hand: number;
  reserved: number;
  sold: number;
};

export type ChatMessageRow = {
  id: number;
  session_id: string;
  locale: string;
  role: "user" | "assistant";
  content: string;
  /** "ai" or "faq:<rule>" (canned answer). */
  source: string;
  created_at: string;
};

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      products: Table<ProductRow>;
      product_translations: Table<ProductTranslationRow>;
      product_media: Table<ProductMediaRow>;
      variants: Table<VariantRow>;
      orders: Table<OrderRow>;
      order_items: Table<OrderItemRow>;
      order_events: Table<OrderEventRow>;
      payments: Table<PaymentRow>;
      bank_transactions: Table<BankTransactionRow>;
      inventory_movements: Table<InventoryMovementRow>;
      chat_messages: Table<ChatMessageRow>;
    };
    Views: {
      variant_stock: { Row: VariantStockRow; Relationships: [] };
    };
    Functions: {
      set_order_status: {
        Args: { p_order_id: string; p_status: OrderStatus; p_note?: string | null };
        Returns: OrderRow;
      };
    };
    Enums: {
      order_status: OrderStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      movement_reason: MovementReason;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Db = SupabaseClient<Database>;

let client: Db | null = null;

/** Server-only Supabase client using the service role key. Returns null when the DB is not configured. */
export function getDb(): Db | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!client) {
    client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export function requireDb(): Db {
  const db = getDb();
  if (!db) throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  return db;
}
