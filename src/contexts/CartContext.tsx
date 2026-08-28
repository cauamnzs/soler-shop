import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  useState,
} from "react";
import { CartItem, CartState, Product } from "@/types";

/* ══════════════════════════════════════════════════════════════════
   CONSTANTES
   ══════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = "soler-cart";
const STORAGE_VERSION = 1;
const FREE_SHIPPING_THRESHOLD = 299;

/* ══════════════════════════════════════════════════════════════════
   UTILITÁRIOS DE PREÇO (centralizados)
   ══════════════════════════════════════════════════════════════════ */

export const parsePrice = (formatted: string | number | null | undefined): number => {
  if (typeof formatted === "number") return isFinite(formatted) ? formatted : 0;
  if (typeof formatted !== "string" || !formatted.trim()) return 0;
  const digits = formatted.replace(/[^\d,]/g, "").replace(",", ".");
  const n = parseFloat(digits);
  return isFinite(n) ? n : 0;
};

export const formatPrice = (value: number): string => {
  const v = isFinite(value) && value >= 0 ? value : 0;
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

export const FREE_SHIPPING = FREE_SHIPPING_THRESHOLD;

/* ══════════════════════════════════════════════════════════════════
   REDUCER
   ══════════════════════════════════════════════════════════════════ */

type CartAction =
  | { type: "HYDRATE"; payload: CartState }
  | { type: "ADD_ITEM"; product: Product; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "SET_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR" };

const emptyState = (): CartState => ({
  items: [],
  version: STORAGE_VERSION,
  updatedAt: Date.now(),
});

const stamp = (s: CartState): CartState => ({ ...s, updatedAt: Date.now() });

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD_ITEM": {
      const qty = Math.max(1, Math.floor(action.quantity) || 1);
      const idx = state.items.findIndex((i) => i.product.id === action.product.id);
      const nextItems = [...state.items];
      if (idx >= 0) {
        nextItems[idx] = { ...nextItems[idx], quantity: nextItems[idx].quantity + qty };
      } else {
        nextItems.unshift({ product: action.product, quantity: qty, addedAt: Date.now() });
      }
      return stamp({ ...state, items: nextItems });
    }

    case "REMOVE_ITEM":
      return stamp({ ...state, items: state.items.filter((i) => i.product.id !== action.productId) });

    case "SET_QUANTITY": {
      const qty = Math.max(1, Math.floor(action.quantity) || 1);
      return stamp({
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: qty } : i
        ),
      });
    }

    case "CLEAR":
      return emptyState();

    default:
      return state;
  }
};

/* ══════════════════════════════════════════════════════════════════
   MIGRAÇÃO (stub "soler-cart-preview" PACOTE P → soler-cart v1)
   ══════════════════════════════════════════════════════════════════ */

const migrateFromPreview = (): CartState | null => {
  try {
    const raw = localStorage.getItem("soler-cart-preview");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Array<{ product: Product; quantity: number }>;
    if (!Array.isArray(parsed)) return null;
    const items: CartItem[] = parsed
      .filter((x) => x && x.product && typeof x.product.id === "string")
      .map((x) => ({
        product: x.product,
        quantity: Math.max(1, Math.floor(x.quantity) || 1),
        addedAt: Date.now(),
      }));
    localStorage.removeItem("soler-cart-preview");
    return { items, version: STORAGE_VERSION, updatedAt: Date.now() };
  } catch {
    return null;
  }
};

/* ══════════════════════════════════════════════════════════════════
   CONTEXT VALUE + PROVIDER
   ══════════════════════════════════════════════════════════════════ */

interface CartContextValue {
  hydrated: boolean;
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingProgress: number;
  amountToFreeShipping: number;
  hasFreeShipping: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, emptyState);
  const [hydrated, setHydrated] = useState(false);

  // Hydration SSR-safe
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed && parsed.version === STORAGE_VERSION && Array.isArray(parsed.items)) {
          dispatch({ type: "HYDRATE", payload: parsed });
          setHydrated(true);
          return;
        }
      }
      const migrated = migrateFromPreview();
      if (migrated) dispatch({ type: "HYDRATE", payload: migrated });
    } catch {
      /* noop */
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persistência
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state, hydrated]);

  // Bridge evento custom "soler:cart:add" (compatibilidade PACOTE P AddToCartButton stub)
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ product?: Product; quantity?: number }>;
      if (!ce.detail?.product) return;
      dispatch({ type: "ADD_ITEM", product: ce.detail.product, quantity: ce.detail.quantity ?? 1 });
    };
    window.addEventListener("soler:cart:add", handler as EventListener);
    return () => window.removeEventListener("soler:cart:add", handler as EventListener);
  }, []);

  const addItem = useCallback(
    (product: Product, quantity = 1) => dispatch({ type: "ADD_ITEM", product, quantity }),
    []
  );
  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "REMOVE_ITEM", productId }),
    []
  );
  const setQuantity = useCallback(
    (productId: string, quantity: number) => dispatch({ type: "SET_QUANTITY", productId, quantity }),
    []
  );
  const increment = useCallback(
    (productId: string) => {
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return;
      dispatch({ type: "SET_QUANTITY", productId, quantity: item.quantity + 1 });
    },
    [state.items]
  );
  const decrement = useCallback(
    (productId: string) => {
      const item = state.items.find((i) => i.product.id === productId);
      if (!item) return;
      if (item.quantity <= 1) dispatch({ type: "REMOVE_ITEM", productId });
      else dispatch({ type: "SET_QUANTITY", productId, quantity: item.quantity - 1 });
    },
    [state.items]
  );
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  // Derived state
  const { count, subtotal, shipping, total, freeShippingProgress, amountToFreeShipping, hasFreeShipping } =
    useMemo(() => {
      const count = state.items.reduce((a, i) => a + (i.quantity || 0), 0);
      const subtotal = state.items.reduce(
        (a, i) => a + parsePrice(i.product.price) * (i.quantity || 0),
        0
      );
      const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
      const shipping = hasFreeShipping ? 0 : subtotal > 0 ? 19.9 : 0;
      const total = subtotal + shipping;
      const progressRaw = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
      const freeShippingProgress = Math.min(100, Math.max(0, progressRaw));
      const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
      return { count, subtotal, shipping, total, freeShippingProgress, amountToFreeShipping, hasFreeShipping };
    }, [state.items]);

  const value: CartContextValue = {
    hydrated,
    items: state.items,
    count,
    subtotal,
    shipping,
    total,
    freeShippingProgress,
    amountToFreeShipping,
    hasFreeShipping,
    addItem,
    removeItem,
    setQuantity,
    increment,
    decrement,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider/>");
  return ctx;
};

// Re-exports de UI compartilhados (para App.tsx importar em 1 único lugar)
export { CartDrawerGlobalTrigger, CartIcon } from "@/components/CartIcon";
