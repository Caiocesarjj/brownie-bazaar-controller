
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, Users, Store, Package, ReceiptText, 
  Menu, X, Settings
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import useMobile from '@/hooks/use-mobile';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/resellers', label: 'Revendedores', icon: Store },
  { href: '/inventory', label: 'Estoque', icon: Package },
  { href: '/sales', label: 'Vendas', icon: ReceiptText },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

const Navbar = () => {
  const location = useLocation();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('Sistema de Brownies');

  useEffect(() => {
    // Load logo and company name from localStorage
    const savedLogo = localStorage.getItem('companyLogo');
    const savedName = localStorage.getItem('companyName');
    
    if (savedLogo) setLogo(savedLogo);
    if (savedName) setCompanyName(savedName);
    
    // Setup event listener for storage changes
    const handleStorageChange = () => {
      setLogo(localStorage.getItem('companyLogo'));
      setCompanyName(localStorage.getItem('companyName') || 'Sistema de Brownies');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check for changes every 2 seconds (in case localStorage is changed in the same window)
    const interval = setInterval(() => {
      const currentLogo = localStorage.getItem('companyLogo');
      const currentName = localStorage.getItem('companyName');
      
      if (currentLogo !== logo) setLogo(currentLogo);
      if (currentName !== companyName) setCompanyName(currentName || 'Sistema de Brownies');
    }, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setIsOpen(false)}
          >
            <Button
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "justify-start gap-2 whitespace-nowrap",
                isActive 
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground"
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b"
    >
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            {logo ? (
              <img 
                src={logo} 
                alt={companyName} 
                className="w-8 h-8 object-contain" 
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center rounded-md bg-primary">
                <Package size={18} className="text-primary-foreground" />
              </div>
            )}
            <span className="font-semibold">{companyName}</span>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          {isMobile ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={18} className="rotate-0 scale-100 transition-all" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 flex flex-col gap-4 pt-8">
                <NavLinks />
              </SheetContent>
            </Sheet>
          ) : (
            <nav className="flex items-center gap-1 mx-6">
              <NavLinks />
            </nav>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
