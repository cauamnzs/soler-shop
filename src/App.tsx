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
import NotFound from "@/pages/NotFound";

const Index = lazy(() => import("@/pages/Index"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));

const PageLoader = () => (
  <div className="fixed inset-0 z-[99950] bg-background flex items-center justify-center">
    <div className="relative flex flex-col items-center gap-5">
      <div className="relative w-14 h-14 md:w-16 md:h-16">
        <div className="absolute inset-0 rounded-full border border-gold/25" />
        <div className="absolute inset-0 rounded-full border-2 border-t-gold border-l-gold/80 border-r-transparent border-b-transparent animate-spin" style={{ animationDuration: "1.1s", animationTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }} />
        <div className="absolute inset-[14px] md:inset-[16px] rounded-full bg-gold/30 animate-pulse" />
      </div>
      <div className="font-heading text-[10px] md:text-xs uppercase tracking-[0.5em] text-muted-foreground/70">
        Soler
      </div>
    </div>
  </div>
);

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
              <Suspense fallback={<PageLoader />}>
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
