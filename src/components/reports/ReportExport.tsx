
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { FileText, FileSpreadsheet, Calendar, Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { exportReport } from '@/lib/reports';
import { toast } from '@/components/ui/use-toast';

type ReportType = 'clients' | 'products' | 'sales' | 'expenses' | 'inventory';
type ReportFormat = 'pdf' | 'excel';

interface ReportExportProps {
  defaultReportType?: ReportType;
  reportTypeOptions?: Array<{ value: ReportType; label: string }>;
}

const ReportExport: React.FC<ReportExportProps> = ({ 
  defaultReportType = 'sales',
  reportTypeOptions = [
    { value: 'clients', label: 'Clientes' },
    { value: 'products', label: 'Produtos' },
    { value: 'sales', label: 'Vendas' },
    { value: 'expenses', label: 'Despesas' },
    { value: 'inventory', label: 'Inventário' }
  ]
}) => {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>(defaultReportType);
  const [reportFormat, setReportFormat] = useState<ReportFormat>('pdf');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [loading, setLoading] = useState(false);
  
  const handleExport = async () => {
    try {
      setLoading(true);
      
      const filters = {
        startDate: dateRange.from,
        endDate: dateRange.to
      };
      
      await exportReport(reportType, reportFormat, filters);
      
      toast({
        title: "Relatório gerado com sucesso",
        description: "O download do seu relatório começará automaticamente.",
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao gerar o relatório",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)} 
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        Exportar Relatório
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Exportar Relatório</DialogTitle>
            <DialogDescription>
              Selecione as opções para gerar um relatório exportável
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reportType" className="text-right">
                Relatório
              </Label>
              <Select 
                value={reportType} 
                onValueChange={(value) => setReportType(value as ReportType)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">
                Formato
              </Label>
              <div className="col-span-3 flex gap-4">
                <Button
                  type="button"
                  variant={reportFormat === 'pdf' ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                  onClick={() => setReportFormat('pdf')}
                >
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
                <Button
                  type="button"
                  variant={reportFormat === 'excel' ? 'default' : 'outline'}
                  className="flex-1 gap-2"
                  onClick={() => setReportFormat('excel')}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Período
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        )
                      ) : (
                        <span>Selecione um período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={{
                        from: dateRange.from,
                        to: dateRange.to,
                      }}
                      onSelect={(range) => 
                        setDateRange({ 
                          from: range?.from, 
                          to: range?.to 
                        })
                      }
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport} disabled={loading}>
              {loading ? "Gerando..." : "Exportar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportExport;
