// Mock database for the brownie sales system
// This would be replaced with actual SQLite or other database in a real app

// Types
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
  commission: number; // Percentage
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;  // Novo campo: preço de custo
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

// Mock data
const clients: Client[] = [
  { id: '1', name: 'Ana Silva', phone: '(11) 99999-1234', paymentDate: new Date(2023, 10, 15), createdAt: new Date('2023-10-15') },
  { id: '2', name: 'Carlos Oliveira', phone: '(11) 98765-4321', createdAt: new Date('2023-11-05') },
  { id: '3', name: 'Mariana Costa', phone: '(11) 97777-8888', paymentDate: new Date(2023, 12, 10), createdAt: new Date('2023-12-10') },
  { id: '4', name: 'João Pereira', phone: '(11) 96666-5555', createdAt: new Date('2024-01-20') },
  { id: '5', name: 'Juliana Santos', phone: '(11) 95555-4444', paymentDate: new Date(2024, 2, 10), createdAt: new Date('2024-02-08') },
];

const resellers: Reseller[] = [
  { id: '1', name: 'Pedro Almeida', phone: '(11) 94444-3333', commission: 15, createdAt: new Date('2023-09-20') },
  { id: '2', name: 'Fernanda Lima', phone: '(11) 93333-2222', commission: 20, createdAt: new Date('2023-10-25') },
  { id: '3', name: 'Ricardo Souza', phone: '(11) 92222-1111', commission: 18, createdAt: new Date('2023-12-15') },
];

const products: Product[] = [
  { id: '1', name: 'Brownie Tradicional', quantity: 45, unitPrice: 8.50, costPrice: 3.20, createdAt: new Date('2023-10-01') },
  { id: '2', name: 'Brownie com Nozes', quantity: 30, unitPrice: 10.00, costPrice: 4.50, createdAt: new Date('2023-10-01') },
  { id: '3', name: 'Brownie Recheado', quantity: 25, unitPrice: 12.50, costPrice: 5.30, createdAt: new Date('2023-11-15') },
  { id: '4', name: 'Brownie Vegano', quantity: 15, unitPrice: 14.00, costPrice: 6.80, createdAt: new Date('2024-01-10') },
  { id: '5', name: 'Brownie Zero Açúcar', quantity: 18, unitPrice: 15.00, costPrice: 7.20, createdAt: new Date('2024-02-05') },
];

const sales: Sale[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Ana Silva',
    resellerId: '2',
    resellerName: 'Fernanda Lima',
    items: [
      { productId: '1', productName: 'Brownie Tradicional', quantity: 5, unitPrice: 8.50 },
      { productId: '2', productName: 'Brownie com Nozes', quantity: 3, unitPrice: 10.00 }
    ],
    totalAmount: 72.50,
    date: new Date('2024-03-15')
  },
  {
    id: '2',
    clientId: '3',
    clientName: 'Mariana Costa',
    resellerId: '1',
    resellerName: 'Pedro Almeida',
    items: [
      { productId: '3', productName: 'Brownie Recheado', quantity: 8, unitPrice: 12.50 }
    ],
    totalAmount: 100.00,
    date: new Date('2024-03-18')
  },
  {
    id: '3',
    clientId: '2',
    clientName: 'Carlos Oliveira',
    resellerId: '3',
    resellerName: 'Ricardo Souza',
    items: [
      { productId: '4', productName: 'Brownie Vegano', quantity: 4, unitPrice: 14.00 },
      { productId: '5', productName: 'Brownie Zero Açúcar', quantity: 2, unitPrice: 15.00 }
    ],
    totalAmount: 86.00,
    date: new Date('2024-03-20')
  },
  {
    id: '4',
    clientId: '5',
    clientName: 'Juliana Santos',
    resellerId: '2',
    resellerName: 'Fernanda Lima',
    items: [
      { productId: '1', productName: 'Brownie Tradicional', quantity: 10, unitPrice: 8.50 }
    ],
    totalAmount: 85.00,
    date: new Date('2024-03-23')
  },
  {
    id: '5',
    clientId: '4',
    clientName: 'João Pereira',
    resellerId: '1',
    resellerName: 'Pedro Almeida',
    items: [
      { productId: '2', productName: 'Brownie com Nozes', quantity: 6, unitPrice: 10.00 },
      { productId: '3', productName: 'Brownie Recheado', quantity: 4, unitPrice: 12.50 }
    ],
    totalAmount: 110.00,
    date: new Date('2024-03-25')
  }
];

const expenses: Expense[] = [
  {
    id: '1',
    itemName: 'Chocolate em Barra',
    quantity: 20,
    unitCost: 8.5,
    totalCost: 170,
    date: new Date('2024-03-05')
  },
  {
    id: '2',
    itemName: 'Açúcar',
    quantity: 15,
    unitCost: 4.2,
    totalCost: 63,
    date: new Date('2024-03-07')
  },
  {
    id: '3',
    itemName: 'Nozes',
    quantity: 5,
    unitCost: 25,
    totalCost: 125,
    date: new Date('2024-03-10')
  },
  {
    id: '4',
    itemName: 'Manteiga',
    quantity: 10,
    unitCost: 7.5,
    totalCost: 75,
    date: new Date('2024-03-15')
  },
  {
    id: '5',
    itemName: 'Farinha',
    quantity: 25,
    unitCost: 3.8,
    totalCost: 95,
    date: new Date('2024-03-20')
  }
];

// Database API
export const db = {
  // Clients
  getClients: () => [...clients],
  getClient: (id: string) => clients.find(client => client.id === id),
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient = {
      ...client,
      id: (clients.length + 1).toString(),
      createdAt: new Date()
    };
    clients.push(newClient);
    return newClient;
  },
  updateClient: (id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>) => {
    const index = clients.findIndex(client => client.id === id);
    if (index >= 0) {
      clients[index] = { ...clients[index], ...data };
      return clients[index];
    }
    return null;
  },
  deleteClient: (id: string) => {
    const index = clients.findIndex(client => client.id === id);
    if (index >= 0) {
      const deletedClient = clients[index];
      clients.splice(index, 1);
      return deletedClient;
    }
    return null;
  },

  // Resellers
  getResellers: () => [...resellers],
  getReseller: (id: string) => resellers.find(reseller => reseller.id === id),
  addReseller: (reseller: Omit<Reseller, 'id' | 'createdAt'>) => {
    const newReseller = {
      ...reseller,
      id: (resellers.length + 1).toString(),
      createdAt: new Date()
    };
    resellers.push(newReseller);
    return newReseller;
  },
  updateReseller: (id: string, data: Partial<Omit<Reseller, 'id' | 'createdAt'>>) => {
    const index = resellers.findIndex(reseller => reseller.id === id);
    if (index >= 0) {
      resellers[index] = { ...resellers[index], ...data };
      return resellers[index];
    }
    return null;
  },
  deleteReseller: (id: string) => {
    const index = resellers.findIndex(reseller => reseller.id === id);
    if (index >= 0) {
      const deletedReseller = resellers[index];
      resellers.splice(index, 1);
      return deletedReseller;
    }
    return null;
  },

  // Products
  getProducts: () => [...products],
  getProduct: (id: string) => products.find(product => product.id === id),
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct = {
      ...product,
      id: (products.length + 1).toString(),
      createdAt: new Date()
    };
    products.push(newProduct);
    return newProduct;
  },
  updateProduct: (id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    const index = products.findIndex(product => product.id === id);
    if (index >= 0) {
      products[index] = { ...products[index], ...data };
      return products[index];
    }
    return null;
  },
  deleteProduct: (id: string) => {
    const index = products.findIndex(product => product.id === id);
    if (index >= 0) {
      const deletedProduct = products[index];
      products.splice(index, 1);
      return deletedProduct;
    }
    return null;
  },

  // Sales
  getSales: () => [...sales],
  getSale: (id: string) => sales.find(sale => sale.id === id),
  addSale: (sale: Omit<Sale, 'id'>) => {
    // Update inventory
    sale.items.forEach(item => {
      const productIndex = products.findIndex(p => p.id === item.productId);
      if (productIndex >= 0) {
        products[productIndex].quantity -= item.quantity;
      }
    });
    
    const newSale = {
      ...sale,
      id: (sales.length + 1).toString()
    };
    sales.push(newSale);
    return newSale;
  },
  
  // Expenses
  getExpenses: () => [...expenses],
  getExpense: (id: string) => expenses.find(expense => expense.id === id),
  addExpense: (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: (expenses.length + 1).toString()
    };
    expenses.push(newExpense);
    return newExpense;
  },
  updateExpense: (id: string, data: Partial<Omit<Expense, 'id'>>) => {
    const index = expenses.findIndex(expense => expense.id === id);
    if (index >= 0) {
      expenses[index] = { ...expenses[index], ...data };
      return expenses[index];
    }
    return null;
  },
  deleteExpense: (id: string) => {
    const index = expenses.findIndex(expense => expense.id === id);
    if (index >= 0) {
      const deletedExpense = expenses[index];
      expenses.splice(index, 1);
      return deletedExpense;
    }
    return null;
  },
  
  // Dashboard data
  getDashboardData: () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Monthly sales
    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    
    const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    
    // Monthly expenses
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const monthlyExpensesTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.totalCost, 0);
    
    // Calculate profit
    const monthlyProfit = monthlyRevenue - monthlyExpensesTotal;
    
    // Low stock products (less than 20 units)
    const lowStockProducts = products.filter(product => product.quantity < 20);
    
    // Top selling products
    const productSales = new Map<string, number>();
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const currentQuantity = productSales.get(item.productId) || 0;
        productSales.set(item.productId, currentQuantity + item.quantity);
      });
    });
    
    const topProducts = Array.from(productSales.entries())
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return {
          id: productId,
          name: product?.name || 'Unknown Product',
          quantity
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);
    
    // Top resellers
    const resellerSales = new Map<string, number>();
    sales.forEach(sale => {
      const currentTotal = resellerSales.get(sale.resellerId) || 0;
      resellerSales.set(sale.resellerId, currentTotal + sale.totalAmount);
    });
    
    const topResellers = Array.from(resellerSales.entries())
      .map(([resellerId, total]) => {
        const reseller = resellers.find(r => r.id === resellerId);
        return {
          id: resellerId,
          name: reseller?.name || 'Unknown Reseller',
          total
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
      
    // Recent sales
    const recentSales = [...sales]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
      
    // Recent expenses
    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
      
    return {
      totalSales: sales.length,
      totalRevenue: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
      totalClients: clients.length,
      totalResellers: resellers.length,
      monthlyRevenue,
      monthlySales: monthlySales.length,
      monthlyExpensesTotal,
      monthlyProfit,
      lowStockProducts,
      topProducts,
      topResellers,
      recentSales,
      recentExpenses
    };
  }
};
