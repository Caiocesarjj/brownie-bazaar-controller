
import { Client, Reseller, Product, Sale, Expense, User, DashboardData } from './types';
import { db } from './index';

// Re-exportar os tipos para facilitar o acesso
export type {
  Client,
  Reseller,
  Product,
  Sale,
  Expense,
  User,
  DashboardData
};

// API de Cliente
export const ClientAPI = {
  getAll: () => db.getClients(),
  getById: (id: string) => db.getClient(id),
  create: (client: Omit<Client, 'id' | 'createdAt'>) => db.addClient(client),
  update: (id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>) => db.updateClient(id, data),
  delete: (id: string) => db.deleteClient(id)
};

// API de Revendedor
export const ResellerAPI = {
  getAll: () => db.getResellers(),
  getById: (id: string) => db.getReseller(id),
  create: (reseller: Omit<Reseller, 'id' | 'createdAt'>) => db.addReseller(reseller),
  update: (id: string, data: Partial<Omit<Reseller, 'id' | 'createdAt'>>) => db.updateReseller(id, data),
  delete: (id: string) => db.deleteReseller(id)
};

// API de Produto
export const ProductAPI = {
  getAll: () => db.getProducts(),
  getById: (id: string) => db.getProduct(id),
  create: (product: Omit<Product, 'id' | 'createdAt'>) => db.addProduct(product),
  update: (id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) => db.updateProduct(id, data),
  delete: (id: string) => db.deleteProduct(id)
};

// API de Venda
export const SaleAPI = {
  getAll: () => db.getSales(),
  getById: (id: string) => db.getSale(id),
  create: (sale: Omit<Sale, 'id'>) => db.addSale(sale)
};

// API de Despesa
export const ExpenseAPI = {
  getAll: () => db.getExpenses(),
  getById: (id: string) => db.getExpense(id),
  create: (expense: Omit<Expense, 'id'>) => db.addExpense(expense),
  update: (id: string, data: Partial<Omit<Expense, 'id'>>) => db.updateExpense(id, data),
  delete: (id: string) => db.deleteExpense(id)
};

// API de Usuário
export const UserAPI = {
  authenticate: (username: string, password: string) => db.authenticateUser(username, password),
  getAll: () => db.getUsers(),
  getById: (id: string) => db.getUser(id),
  create: (user: Omit<User, 'id' | 'createdAt'>) => db.addUser(user),
  update: (id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>) => db.updateUser(id, data),
  delete: (id: string) => db.deleteUser(id)
};

// API de Dashboard
export const DashboardAPI = {
  getData: () => db.getDashboardData()
};
