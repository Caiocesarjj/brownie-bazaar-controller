
// Tipos para entidades do banco de dados
export interface Client {
  id: string;
  name: string;
  phone: string;
  paymentDate?: Date;
  createdAt: Date;
}

export interface Reseller {
  id: string;
  name: string;
  phone: string;
  commission: number; // Percentual
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;  // Preço de custo
  createdAt: Date;
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  resellerId: string;
  resellerName: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  date: Date;
}

export interface Expense {
  id: string;
  itemName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  date: Date;
}

export interface User {
  id: string;
  username: string;
  password: string; // Na vida real, isso seria um hash, não senha em texto puro
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Tipo para o resultado do Dashboard
export interface DashboardData {
  totalSales: number;
  totalRevenue: number;
  totalClients: number;
  totalResellers: number;
  monthlyRevenue: number;
  monthlySales: number;
  monthlyExpensesTotal: number;
  monthlyProfit: number;
  lowStockProducts: Product[];
  topProducts: { id: string; name: string; quantity: number }[];
  topResellers: { id: string; name: string; total: number }[];
  recentSales: Sale[];
  recentExpenses: Expense[];
}

// Interface para o provedor de banco de dados
// Todas as operações são promessas para permitir integrações assíncronas (HTTP API, etc.)
export interface DatabaseProvider {
  // Clientes
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | null>;
  addClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client>;
  updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client | null>;
  deleteClient(id: string): Promise<Client | null>;

  // Revendedores
  getResellers(): Promise<Reseller[]>;
  getReseller(id: string): Promise<Reseller | null>;
  addReseller(reseller: Omit<Reseller, 'id' | 'createdAt'>): Promise<Reseller>;
  updateReseller(id: string, data: Partial<Omit<Reseller, 'id' | 'createdAt'>>): Promise<Reseller | null>;
  deleteReseller(id: string): Promise<Reseller | null>;

  // Produtos
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product>;
  updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null>;
  deleteProduct(id: string): Promise<Product | null>;

  // Vendas
  getSales(): Promise<Sale[]>;
  getSale(id: string): Promise<Sale | null>;
  addSale(sale: Omit<Sale, 'id'>): Promise<Sale>;

  // Despesas
  getExpenses(): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | null>;
  addExpense(expense: Omit<Expense, 'id'>): Promise<Expense>;
  updateExpense(id: string, data: Partial<Omit<Expense, 'id'>>): Promise<Expense | null>;
  deleteExpense(id: string): Promise<Expense | null>;

  // Autenticação e usuários
  authenticateUser(username: string, password: string): Promise<User | null>;
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | null>;
  addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null>;
  deleteUser(id: string): Promise<User | null>;

  // Dashboard
  getDashboardData(): Promise<DashboardData>;
}
