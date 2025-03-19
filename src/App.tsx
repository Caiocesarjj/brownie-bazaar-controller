
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import { Toaster } from './components/ui/toaster';
import PageTransition from './components/layout/PageTransition';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-load pages
const Index = lazy(() => import('./pages/Index'));
const Clients = lazy(() => import('./pages/Clients'));
const Resellers = lazy(() => import('./pages/Resellers'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Sales = lazy(() => import('./pages/Sales'));
const Settings = lazy(() => import('./pages/Settings'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Users = lazy(() => import('./pages/Users'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={
            <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Carregando...</div>}>
              <Login />
            </Suspense>
          } />
          
          <Route path="*" element={
            <>
              <Navbar />
              <PageTransition>
                <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Carregando...</div>}>
                  <Routes>
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    <Route path="/clients" element={
                      <ProtectedRoute>
                        <Clients />
                      </ProtectedRoute>
                    } />
                    <Route path="/resellers" element={
                      <ProtectedRoute>
                        <Resellers />
                      </ProtectedRoute>
                    } />
                    <Route path="/inventory" element={
                      <ProtectedRoute>
                        <Inventory />
                      </ProtectedRoute>
                    } />
                    <Route path="/sales" element={
                      <ProtectedRoute>
                        <Sales />
                      </ProtectedRoute>
                    } />
                    <Route path="/expenses" element={
                      <ProtectedRoute>
                        <Expenses />
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                      <ProtectedRoute adminOnly={true}>
                        <Users />
                      </ProtectedRoute>
                    } />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Suspense>
              </PageTransition>
              <Toaster />
            </>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
