
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users,
  UserRound,
  Package,
  ShoppingBag,
  Settings,
  CreditCard,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const routes = [
    { href: '/', name: 'Dashboard', icon: <Home size={20} /> },
    { href: '/clients', name: 'Clientes', icon: <Users size={20} /> },
    { href: '/resellers', name: 'Revendedores', icon: <UserRound size={20} /> },
    { href: '/inventory', name: 'Estoque', icon: <Package size={20} /> },
    { href: '/sales', name: 'Vendas', icon: <ShoppingBag size={20} /> },
    { href: '/expenses', name: 'Despesas', icon: <CreditCard size={20} /> },
    { href: '/settings', name: 'Configurações', icon: <Settings size={20} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Brownie Sales</span>
        </Link>
        
        <div className="flex space-x-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant={location.pathname === route.href ? "default" : "ghost"}
              size={isMobile ? "icon" : "default"}
              className={isMobile ? "w-10 h-10 p-0" : ""}
            >
              <Link to={route.href}>
                {route.icon}
                {!isMobile && <span>{route.name}</span>}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
