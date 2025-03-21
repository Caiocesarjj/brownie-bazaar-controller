
// Este arquivo é mantido por compatibilidade com código existente
// Ele simplesmente re-exporta todas as funcionalidades da nova estrutura

import { db } from './database/index';
export * from './database/models';
export * from './database/types';
export * from './database/index';

// Exportar o banco de dados padrão para compatibilidade com código existente
export { db };

// Aviso de depreciação no console para motivar a migração
console.warn(
  'O arquivo src/lib/database.ts está depreciado. ' + 
  'Por favor, importe de @/lib/database/index ou @/lib/database/models diretamente.'
);
