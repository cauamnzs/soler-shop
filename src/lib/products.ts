import { Product } from "@/types";
import { supabase } from "@/lib/supabaseClient";

type ProductRow = {
  sku: string;
  name: string;
  price: string | number;
  brand: string;
  image_url: string;
  description: string | null;
  is_active: boolean;
};

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const normalizePrice = (value: string | number): string => {
  if (typeof value === "string") {
    if (value.startsWith("R$")) return value;

    const parsed = Number(value.replace(/[^\d,.-]/g, "").replace(",", "."));
    return Number.isFinite(parsed) ? brlFormatter.format(parsed) : value;
  }

  if (!Number.isFinite(value)) return "R$ 0,00";
  return brlFormatter.format(value);
};

const mapRowToProduct = (row: ProductRow): Product => ({
  id: row.sku,
  name: row.name,
  price: normalizePrice(row.price),
  image: row.image_url,
  tag: null,
  category: row.brand,
  description: row.description ?? "",
});

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("catalog_products")
    .select("sku, name, brand, price, image_url, description, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as ProductRow[]).map(mapRowToProduct);
}
