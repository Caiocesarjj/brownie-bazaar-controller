
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import { Toaster } from './components/ui/toaster';
import PageTransition from './components/layout/PageTransition';

// Lazy-load pages
const Index = lazy(() => import('./pages/Index'));
const Clients = lazy(() => import('./pages/Clients'));
const Resellers = lazy(() => import('./pages/Resellers'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Sales = lazy(() => import('./pages/Sales'));
const Settings = lazy(() => import('./pages/Settings'));
const Expenses = lazy(() => import('./pages/Expenses'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <PageTransition>
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Carregando...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/resellers" element={<Resellers />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
