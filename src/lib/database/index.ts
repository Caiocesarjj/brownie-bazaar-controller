
import { DatabaseProvider } from './types';
import { MemoryDatabase } from './memory-db';
import { HttpDatabase } from './http-db';

// Exportar os tipos
export * from './types';

// Selecionador de provedor de banco de dados 
let databaseProvider: DatabaseProvider;

// Inicializar o provedor de banco de dados baseado em configuração
function initializeDatabase() {
  // Verificar qual provedor de banco de dados deve ser usado
  const dbProvider = localStorage.getItem('dbProvider') || 'memory';
  
  switch (dbProvider) {
    case 'http':
      // Pode obter a URL da API de uma variável de ambiente ou localStorage
      const apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:5000/api';
      return new HttpDatabase(apiUrl);
    case 'memory':
    default:
      return new MemoryDatabase();
  }
}

// Garantir que temos apenas uma instância
export function getDatabaseProvider() {
  if (!databaseProvider) {
    databaseProvider = initializeDatabase();
  }
  return databaseProvider;
}

// Permitir mudar o provedor de banco de dados em tempo de execução
export function setDatabaseProvider(provider: 'memory' | 'http', config?: { apiUrl?: string }) {
  localStorage.setItem('dbProvider', provider);
  
  if (provider === 'http' && config?.apiUrl) {
    localStorage.setItem('apiUrl', config.apiUrl);
  }
  
  // Resetar o provedor para que seja reinicializado na próxima chamada
  databaseProvider = undefined as unknown as DatabaseProvider;
  
  return getDatabaseProvider();
}

// Exportar o provedor de banco de dados como 'db' para compatibilidade
export const db = getDatabaseProvider();
