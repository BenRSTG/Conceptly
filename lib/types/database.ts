/**
 * Hand-written mirror of supabase/migrations/0001_init.sql, in the shape
 * `@supabase/supabase-js` expects for its `Database` generic. Regenerate
 * with `supabase gen types typescript` once a live project exists and this
 * file drifts.
 */

export type ProductStatus = "draft" | "published" | "archived";
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "fulfilled"
  | "cancelled"
  | "refunded";
export type PaymentProvider = "stripe" | "paypal";
export type ShopEventType =
  | "view_item"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase";
export type NewsletterStatus = "pending" | "confirmed" | "unsubscribed";
export type CampaignStatus = "draft" | "scheduled" | "sent";
export type MessageDirection = "admin_to_customer" | "customer_to_admin";
export type InstagramFormat = "square" | "story";

type TableDef<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type AdminUserRow = {
  user_id: string;
  created_at: string;
}

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
}

export type ProductRow = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  base_price: number;
  sale_price: number | null;
  currency: string;
  status: ProductStatus;
  featured: boolean;
  weight_grams: number | null;
  stock_quantity: number | null;
  stock_tracking: boolean;
  low_stock_threshold: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductImageRow = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export type ProductVariantRow = {
  id: string;
  product_id: string;
  variant_name: string;
  sku: string | null;
  price_override: number | null;
  stock_quantity: number | null;
  attributes: Record<string, unknown>;
}

export type CustomerRow = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  newsletter_opt_in: boolean;
  created_at: string;
}

export type AddressRow = {
  id: string;
  customer_id: string;
  label: string | null;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  is_default: boolean;
}

export type OrderRow = {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_email: string;
  status: OrderStatus;
  payment_provider: PaymentProvider | null;
  payment_reference: string | null;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
  shipping_address: Record<string, unknown> | null;
  billing_address: Record<string, unknown> | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_title_snapshot: string;
  quantity: number;
  unit_price: number;
}

export type StockMovementRow = {
  id: string;
  product_id: string | null;
  variant_id: string | null;
  change_amount: number;
  reason: string | null;
  order_id: string | null;
  created_at: string;
}

export type ShopEventRow = {
  id: string;
  event_type: ShopEventType;
  product_id: string | null;
  session_id: string | null;
  customer_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  status: NewsletterStatus;
  confirm_token: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  source: string | null;
  created_at: string;
}

export type NewsletterCampaignRow = {
  id: string;
  subject: string;
  body_html: string;
  status: CampaignStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number | null;
  created_at: string;
}

export type CustomerMessageRow = {
  id: string;
  customer_id: string;
  order_id: string | null;
  direction: MessageDirection;
  subject: string | null;
  body: string;
  read: boolean;
  created_at: string;
}

export type InstagramPostAssetRow = {
  id: string;
  product_id: string | null;
  image_storage_path: string;
  caption_text: string;
  hashtags: string[];
  format: InstagramFormat;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      admin_users: TableDef<AdminUserRow, Omit<AdminUserRow, "created_at">>;
      categories: TableDef<CategoryRow, Omit<CategoryRow, "id"> & { id?: string }>;
      products: TableDef<
        ProductRow,
        Omit<
          ProductRow,
          | "id"
          | "created_at"
          | "updated_at"
          | "currency"
          | "status"
          | "featured"
          | "stock_tracking"
          | "low_stock_threshold"
          | "short_description"
          | "description"
          | "seo_title"
          | "seo_description"
        > & {
          id?: string;
          currency?: string;
          status?: ProductStatus;
          featured?: boolean;
          stock_tracking?: boolean;
          low_stock_threshold?: number;
          short_description?: string | null;
          description?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
        }
      >;
      product_images: TableDef<
        ProductImageRow,
        Omit<ProductImageRow, "id" | "alt_text" | "sort_order" | "is_primary"> & {
          id?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
        }
      >;
      product_variants: TableDef<
        ProductVariantRow,
        Omit<ProductVariantRow, "id" | "sku" | "price_override" | "stock_quantity" | "attributes"> & {
          id?: string;
          sku?: string | null;
          price_override?: number | null;
          stock_quantity?: number | null;
          attributes?: Record<string, unknown>;
        }
      >;
      customers: TableDef<
        CustomerRow,
        Omit<CustomerRow, "created_at" | "full_name" | "phone" | "newsletter_opt_in"> & {
          full_name?: string | null;
          phone?: string | null;
          newsletter_opt_in?: boolean;
        }
      >;
      addresses: TableDef<
        AddressRow,
        Omit<AddressRow, "id" | "label" | "is_default"> & {
          id?: string;
          label?: string | null;
          is_default?: boolean;
        }
      >;
      orders: TableDef<
        OrderRow,
        Omit<
          OrderRow,
          | "id"
          | "created_at"
          | "updated_at"
          | "customer_id"
          | "status"
          | "payment_provider"
          | "payment_reference"
          | "shipping_cost"
          | "tax_amount"
          | "shipping_address"
          | "billing_address"
          | "tracking_number"
        > & {
          id?: string;
          customer_id?: string | null;
          status?: OrderStatus;
          payment_provider?: PaymentProvider | null;
          payment_reference?: string | null;
          shipping_cost?: number;
          tax_amount?: number;
          shipping_address?: Record<string, unknown> | null;
          billing_address?: Record<string, unknown> | null;
          tracking_number?: string | null;
        }
      >;
      order_items: TableDef<
        OrderItemRow,
        Omit<OrderItemRow, "id" | "product_id" | "variant_id"> & {
          id?: string;
          product_id?: string | null;
          variant_id?: string | null;
        }
      >;
      stock_movements: TableDef<
        StockMovementRow,
        Omit<StockMovementRow, "id" | "created_at" | "product_id" | "variant_id" | "reason" | "order_id"> & {
          id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          reason?: string | null;
          order_id?: string | null;
        }
      >;
      shop_events: TableDef<
        ShopEventRow,
        Omit<ShopEventRow, "id" | "created_at"> & { id?: string }
      >;
      newsletter_subscribers: TableDef<
        NewsletterSubscriberRow,
        Omit<NewsletterSubscriberRow, "id" | "created_at"> & { id?: string }
      >;
      newsletter_campaigns: TableDef<
        NewsletterCampaignRow,
        Omit<NewsletterCampaignRow, "id" | "created_at"> & { id?: string }
      >;
      customer_messages: TableDef<
        CustomerMessageRow,
        Omit<CustomerMessageRow, "id" | "created_at"> & { id?: string }
      >;
      instagram_post_assets: TableDef<
        InstagramPostAssetRow,
        Omit<InstagramPostAssetRow, "id" | "created_at"> & { id?: string }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}
