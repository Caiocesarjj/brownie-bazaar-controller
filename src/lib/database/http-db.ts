
import { 
  Client, DatabaseProvider, Expense, Product, Reseller, Sale, User, DashboardData
} from './types';

/**
 * Implementação do provedor de banco de dados que se comunica com uma API C#.
 * Esta classe se conecta a uma API ASP.NET Core e gerencia autenticação via JWT.
 */
export class HttpDatabase implements DatabaseProvider {
  private apiUrl: string;
  private authToken: string | null = null;
  
  constructor(apiUrl: string = 'http://localhost:5000/api') {
    this.apiUrl = apiUrl;
    // Tentar recuperar token salvo
    this.authToken = localStorage.getItem('authToken');
  }
  
  /**
   * Define o token de autenticação para requisições futuras
   */
  public setAuthToken(token: string | null): void {
    this.authToken = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }
  
  /**
   * Método genérico para fazer requisições HTTP para a API C#
   */
  private async fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Adicionar token de autenticação se disponível
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    const defaultOptions: RequestInit = {
      headers,
      ...options
    };
    
    try {
      const response = await fetch(url, defaultOptions);
      
      // Lidar com erros de autenticação
      if (response.status === 401) {
        this.setAuthToken(null);
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      
      if (!response.ok) {
        // Tentar extrair mensagem de erro da API .NET
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || errorData.title || `API respondeu com status: ${response.status}`);
        } catch (parseError) {
          throw new Error(`API respondeu com status: ${response.status}`);
        }
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error(`Erro ao acessar ${endpoint}:`, error);
      throw error;
    }
  }
  
  // Implementação das funções de clientes
  async getClients(): Promise<Client[]> {
    return this.fetchApi<Client[]>('clients');
  }
  
  async getClient(id: string): Promise<Client | null> {
    try {
      return await this.fetchApi<Client>(`clients/${id}`);
    } catch {
      return null;
    }
  }
  
  async addClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    return this.fetchApi<Client>('clients', {
      method: 'POST',
      body: JSON.stringify(client)
    });
  }
  
  async updateClient(id: string, data: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client | null> {
    try {
      return await this.fetchApi<Client>(`clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch {
      return null;
    }
  }
  
  async deleteClient(id: string): Promise<Client | null> {
    try {
      return await this.fetchApi<Client>(`clients/${id}`, {
        method: 'DELETE'
      });
    } catch {
      return null;
    }
  }
  
  // Implementação das funções de revendedores
  async getResellers(): Promise<Reseller[]> {
    return this.fetchApi<Reseller[]>('resellers');
  }
  
  async getReseller(id: string): Promise<Reseller | null> {
    try {
      return await this.fetchApi<Reseller>(`resellers/${id}`);
    } catch {
      return null;
    }
  }
  
  async addReseller(reseller: Omit<Reseller, 'id' | 'createdAt'>): Promise<Reseller> {
    return this.fetchApi<Reseller>('resellers', {
      method: 'POST',
      body: JSON.stringify(reseller)
    });
  }
  
  async updateReseller(id: string, data: Partial<Omit<Reseller, 'id' | 'createdAt'>>): Promise<Reseller | null> {
    try {
      return await this.fetchApi<Reseller>(`resellers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch {
      return null;
    }
  }
  
  async deleteReseller(id: string): Promise<Reseller | null> {
    try {
      return await this.fetchApi<Reseller>(`resellers/${id}`, {
        method: 'DELETE'
      });
    } catch {
      return null;
    }
  }
  
  // Implementação das funções de produtos
  async getProducts(): Promise<Product[]> {
    return this.fetchApi<Product[]>('products');
  }
  
  async getProduct(id: string): Promise<Product | null> {
    try {
      return await this.fetchApi<Product>(`products/${id}`);
    } catch {
      return null;
    }
  }
  
  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    return this.fetchApi<Product>('products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  }
  
  async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product | null> {
    try {
      return await this.fetchApi<Product>(`products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch {
      return null;
    }
  }
  
  async deleteProduct(id: string): Promise<Product | null> {
    try {
      return await this.fetchApi<Product>(`products/${id}`, {
        method: 'DELETE'
      });
    } catch {
      return null;
    }
  }
  
  // Implementação das funções de vendas
  async getSales(): Promise<Sale[]> {
    return this.fetchApi<Sale[]>('sales');
  }
  
  async getSale(id: string): Promise<Sale | null> {
    try {
      return await this.fetchApi<Sale>(`sales/${id}`);
    } catch {
      return null;
    }
  }
  
  async addSale(sale: Omit<Sale, 'id'>): Promise<Sale> {
    return this.fetchApi<Sale>('sales', {
      method: 'POST',
      body: JSON.stringify(sale)
    });
  }
  
  // Implementação das funções de despesas
  async getExpenses(): Promise<Expense[]> {
    return this.fetchApi<Expense[]>('expenses');
  }
  
  async getExpense(id: string): Promise<Expense | null> {
    try {
      return await this.fetchApi<Expense>(`expenses/${id}`);
    } catch {
      return null;
    }
  }
  
  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    return this.fetchApi<Expense>('expenses', {
      method: 'POST',
      body: JSON.stringify(expense)
    });
  }
  
  async updateExpense(id: string, data: Partial<Omit<Expense, 'id'>>): Promise<Expense | null> {
    try {
      return await this.fetchApi<Expense>(`expenses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch {
      return null;
    }
  }
  
  async deleteExpense(id: string): Promise<Expense | null> {
    try {
      return await this.fetchApi<Expense>(`expenses/${id}`, {
        method: 'DELETE'
      });
    } catch {
      return null;
    }
  }
  
  // Autenticação e gestão de usuários
  async authenticateUser(username: string, password: string): Promise<User | null> {
    try {
      const response = await this.fetchApi<{ token: string; user: User }>('auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      // Armazenar token JWT para futuras requisições
      if (response.token) {
        this.setAuthToken(response.token);
      }
      
      return response.user;
    } catch {
      return null;
    }
  }
  
  async getUsers(): Promise<User[]> {
    return this.fetchApi<User[]>('users');
  }
  
  async getUser(id: string): Promise<User | null> {
    try {
      return await this.fetchApi<User>(`users/${id}`);
    } catch {
      return null;
    }
  }
  
  async addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return this.fetchApi<User>('users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  }
  
  async updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    try {
      return await this.fetchApi<User>(`users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch {
      return null;
    }
  }
  
  async deleteUser(id: string): Promise<User | null> {
    try {
      return await this.fetchApi<User>(`users/${id}`, {
        method: 'DELETE'
      });
    } catch {
      return null;
    }
  }
  
  // Métodos para exportação de relatórios (integrados com backend C#)
  async exportPdfReport(reportType: string, filters?: any): Promise<Blob> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await fetch(`${this.apiUrl}/reports/${reportType}/pdf${queryParams}`, {
      headers: this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {},
    });
    
    if (!response.ok) {
      throw new Error(`Falha ao gerar relatório PDF: ${response.statusText}`);
    }
    
    return await response.blob();
  }
  
  async exportExcelReport(reportType: string, filters?: any): Promise<Blob> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    const response = await fetch(`${this.apiUrl}/reports/${reportType}/excel${queryParams}`, {
      headers: this.authToken ? { 'Authorization': `Bearer ${this.authToken}` } : {},
    });
    
    if (!response.ok) {
      throw new Error(`Falha ao gerar relatório Excel: ${response.statusText}`);
    }
    
    return await response.blob();
  }
  
  // Dados do dashboard
  async getDashboardData(): Promise<DashboardData> {
    return this.fetchApi<DashboardData>('dashboard');
  }
}
