import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider, CartDrawerGlobalTrigger } from "@/contexts/CartContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import GlobalShell from "@/components/GlobalShell";
import CookieBanner from "@/components/CookieBanner";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import Index from "@/pages/Index";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";

const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderSuccess = lazy(() => import("@/pages/OrderSuccess"));
const OrderFailure = lazy(() => import("@/pages/OrderFailure"));

const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy"));

const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders"));
const AdminCustomers = lazy(() => import("@/pages/admin/AdminCustomers"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <AdminAuthProvider>
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
              {/* Cookie Consent: banner fixo, persistência localStorage, preferências */}
              <CookieBanner />
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order/success" element={<OrderSuccess />} />
                  <Route path="/order/failure" element={<OrderFailure />} />

                  <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
                  <Route path="/termos-de-uso" element={<TermsOfService />} />
                  <Route path="/trocas-e-devolucoes" element={<RefundPolicy />} />

                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout />
                      </AdminProtectedRoute>
                    }
                  >
                    <Route index element={<AdminOverview />} />
                    <Route path="pedidos" element={<AdminOrders />} />
                    <Route path="clientes" element={<AdminCustomers />} />
                    <Route path="configuracoes" element={<AdminSettings />} />
                  </Route>

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </QueryClientProvider>
    </AdminAuthProvider>
  </ThemeProvider>
);

export default App;
