import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider, CartDrawerGlobalTrigger } from "@/contexts/CartContext";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import GlobalShell from "@/components/GlobalShell";
import Index from "@/pages/Index";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";

const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderSuccess = lazy(() => import("@/pages/OrderSuccess"));
const OrderFailure = lazy(() => import("@/pages/OrderFailure"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Global Shell: decoradores que PERSISTEM em todas as rotas.
                Renderizado ANTES das Routes — NUNCA desmonta ao trocar de página.
                Contém: FluidBackground, Spotlight, CustomCursor, Grain Overlay, Scroll Progress Bar */}
            <GlobalShell />
            {/* Drawer global singleton — 1 instância para todas as páginas */}
            <CartDrawerGlobalTrigger />
            {/* Lead Capture: abre após 35s, persistência localStorage */}
            <LeadCaptureModal />
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/success" element={<OrderSuccess />} />
                <Route path="/order/failure" element={<OrderFailure />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
