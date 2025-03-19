
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, Home, ShoppingBag, Users as UsersIcon, Package, BarChart2, FileText, Settings, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };

  if (!user) return null;

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Clientes", path: "/clients", icon: Users },
    { name: "Revendedores", path: "/resellers", icon: UsersIcon },
    { name: "Estoque", path: "/inventory", icon: Package },
    { name: "Vendas", path: "/sales", icon: ShoppingBag },
    { name: "Despesas", path: "/expenses", icon: FileText },
    { name: "Configurações", path: "/settings", icon: Settings },
  ];

  // Adicionar link para a área de administração se for admin
  if (isAdmin) {
    navItems.push({ name: "Gerenciar Usuários", path: "/users", icon: UserPlus });
  }

  return (
    <div className="border-b">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2 font-semibold">
          <BarChart2 className="h-5 w-5" />
          <span>Brownie Bazaar</span>
        </div>

        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 max-w-screen-md overflow-x-auto">
          {navItems.map((item) => (
            <Link
              to={item.path}
              key={item.path}
              className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="ml-auto flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-4">
            Olá, <span className="font-medium">{user.name}</span>
            {isAdmin && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Admin</span>}
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
