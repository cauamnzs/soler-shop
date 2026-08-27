import { useMemo } from "react";
import { useProducts } from "./useProducts";
import { Product } from "@/types";

export function useProductById(id: string | undefined): {
  product: Product | null;
  isLoading: boolean;
  isError: boolean;
  isNotFound: boolean;
} {
  const { data: products = [], isLoading, isError } = useProducts();

  const product = useMemo(() => {
    if (!id) return null;
    const found = products.find((p) => p.id === id);
    return found ?? null;
  }, [products, id]);

  const isNotFound = !isLoading && !isError && !!id && !product;

  return { product, isLoading, isError, isNotFound };
}
