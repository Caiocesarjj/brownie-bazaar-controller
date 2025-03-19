
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import Resellers from "./pages/Resellers";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import PageTransition from "./components/layout/PageTransition";

// Add framer-motion dependency
import { motion } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <main className="relative">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/resellers" element={<Resellers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
