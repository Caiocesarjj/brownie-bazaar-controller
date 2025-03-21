
/**
 * Módulo para exportação de relatórios PDF e Excel integrando com backend C#
 */
import { db } from './database';

type ReportType = 'clients' | 'products' | 'sales' | 'expenses' | 'inventory';
type ReportFormat = 'pdf' | 'excel';

interface ReportFilter {
  startDate?: Date;
  endDate?: Date;
  clientId?: string;
  resellerId?: string;
  minAmount?: number;
  maxAmount?: number;
  [key: string]: any;
}

/**
 * Exporta um relatório no formato especificado
 */
export async function exportReport(
  reportType: ReportType, 
  format: ReportFormat, 
  filters?: ReportFilter
): Promise<void> {
  try {
    // Verificar se estamos usando o provedor HTTP
    const databaseProvider = localStorage.getItem('dbProvider');
    
    if (databaseProvider !== 'http') {
      throw new Error('A exportação de relatórios só está disponível quando conectado a uma API C#');
    }
    
    // Preparar os filtros para a URL (converter datas para strings)
    const serializedFilters: Record<string, string> = {};
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value instanceof Date) {
          serializedFilters[key] = value.toISOString();
        } else if (value !== undefined && value !== null) {
          serializedFilters[key] = String(value);
        }
      });
    }
    
    // Obter o blob do relatório
    let blob: Blob;
    
    if (format === 'pdf') {
      // Verificar se o método exportPdfReport existe no objeto db
      if ('exportPdfReport' in db) {
        // @ts-ignore - Este método existe no HttpDatabase mas não no tipo DatabaseProvider
        blob = await db.exportPdfReport(reportType, serializedFilters);
      } else {
        throw new Error('Método de exportação PDF não disponível');
      }
    } else {
      // Verificar se o método exportExcelReport existe no objeto db
      if ('exportExcelReport' in db) {
        // @ts-ignore - Este método existe no HttpDatabase mas não no tipo DatabaseProvider
        blob = await db.exportExcelReport(reportType, serializedFilters);
      } else {
        throw new Error('Método de exportação Excel não disponível');
      }
    }
    
    // Criar URL do blob e iniciar download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const extension = format === 'pdf' ? 'pdf' : 'xlsx';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    a.href = url;
    a.download = `relatorio-${reportType}-${timestamp}.${extension}`;
    document.body.appendChild(a);
    a.click();
    
    // Limpar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    throw error;
  }
}
