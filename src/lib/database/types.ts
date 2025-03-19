
// Define os tipos usados no banco de dados
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
  password: string; // Na implementação real, seria um hash
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Interface para o provedor de banco de dados
export interface DatabaseProvider {
  // Clientes
  getClients(): Client[];
  getClient(id: string): Client | undefined;
  addClient(client: Omit<Client, 'id' | 'createdAt'>): Client;
  updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Client | null;
  deleteClient(id: string): Client | null;

  // Revendedores
  getResellers(): Reseller[];
  getReseller(id: string): Reseller | undefined;
  addReseller(reseller: Omit<Reseller, 'id' | 'createdAt'>): Reseller;
  updateReseller(id: string, data: Partial<Omit<Reseller, 'id' | 'createdAt'>>): Reseller | null;
  deleteReseller(id: string): Reseller | null;

  // Produtos
  getProducts(): Product[];
  getProduct(id: string): Product | undefined;
  addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product;
  updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null;
  deleteProduct(id: string): Product | null;

  // Vendas
  getSales(): Sale[];
  getSale(id: string): Sale | undefined;
  addSale(sale: Omit<Sale, 'id'>): Sale;

  // Despesas
  getExpenses(): Expense[];
  getExpense(id: string): Expense | undefined;
  addExpense(expense: Omit<Expense, 'id'>): Expense;
  updateExpense(id: string, data: Partial<Omit<Expense, 'id'>>): Expense | null;
  deleteExpense(id: string): Expense | null;

  // Autenticação
  authenticateUser(username: string, password: string): User | null;

  // Usuários
  getUsers(): User[];
  getUser(id: string): User | undefined;
  addUser(user: Omit<User, 'id' | 'createdAt'>): User;
  updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): User | null;
  deleteUser(id: string): User | null;

  // Dados do Dashboard
  getDashboardData(): any;
}
