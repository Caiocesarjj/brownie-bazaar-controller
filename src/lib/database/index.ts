
import { DatabaseProvider } from './types';
import { MemoryDatabase } from './memory-db';

// Exportar os tipos
export * from './types';

// Selecionador de provedor de banco de dados 
let databaseProvider: DatabaseProvider;

// Inicializar o provedor de banco de dados padrão (em memória)
function initializeDatabase() {
  // Aqui você pode verificar variáveis de ambiente para escolher o provedor
  // Por exemplo: if (process.env.DB_PROVIDER === 'firebase') return new FirebaseDatabase();
  
  return new MemoryDatabase();
}

// Garantir que temos apenas uma instância
export function getDatabaseProvider() {
  if (!databaseProvider) {
    databaseProvider = initializeDatabase();
  }
  return databaseProvider;
}

// Exportar o provedor de banco de dados como 'db' para compatibilidade
export const db = getDatabaseProvider();
