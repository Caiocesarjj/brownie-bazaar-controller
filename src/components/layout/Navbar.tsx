
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, UserRound, Package, ShoppingBag, Menu, X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive 
}: { 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  isActive: boolean;
}) => {
  return (
    <Link to={to} className="relative w-full">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
          "hover:bg-accent/80 relative z-10",
          isActive ? "text-primary font-medium" : "text-muted-foreground"
        )}
      >
        <Icon size={20} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
        <span>{label}</span>
      </div>
      {isActive && (
        <motion.div
          layoutId="active-nav-indicator"
          className="absolute inset-0 rounded-lg bg-accent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/resellers', icon: UserRound, label: 'Revendedores' },
    { path: '/inventory', icon: Package, label: 'Estoque' },
    { path: '/sales', icon: ShoppingBag, label: 'Vendas' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-40",
          "bg-background/80 backdrop-blur-md border-r",
          isMobile ? (
            isMenuOpen ? "translate-x-0 w-[250px]" : "-translate-x-full w-0"
          ) : "w-[250px] translate-x-0"
        )}
      >
        <div className="flex flex-col h-full py-6">
          {/* Logo */}
          <div className="px-6 mb-8">
            <h1 className="text-xl font-semibold tracking-tight">
              <span className="text-primary">Brownie</span> Bazaar
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Sistema de Controle de Vendas</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 px-2 flex-1">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-auto px-6 py-4">
            <div className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Brownie Bazaar
              <p className="mt-1">Versão 1.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Wrapper - push content to the right on desktop */}
      <div className={cn(
        "transition-all duration-300",
        isMobile ? "ml-0" : "ml-[250px]"
      )}>
      </div>
    </>
  );
};

export default Navbar;
