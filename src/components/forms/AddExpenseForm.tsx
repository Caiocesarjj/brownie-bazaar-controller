
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { db } from '@/lib/database';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calculator, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  itemName: z.string().min(2, {
    message: 'O nome do item deve ter pelo menos 2 caracteres.',
  }),
  quantity: z.coerce.number().positive({
    message: 'A quantidade deve ser um número positivo.',
  }),
  unitCost: z.coerce.number().positive({
    message: 'O valor unitário deve ser um número positivo.',
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddExpenseFormProps {
  onSuccess?: () => void;
  expenseToEdit?: {
    id: string;
    itemName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    date: Date;
  } | null;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  onSuccess,
  expenseToEdit = null,
}) => {
  const isEditMode = !!expenseToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: expenseToEdit?.itemName || '',
      quantity: expenseToEdit?.quantity || 0,
      unitCost: expenseToEdit?.unitCost || 0,
      date: expenseToEdit?.date || new Date(),
    },
  });

  // Calculate total cost
  const quantity = form.watch('quantity') || 0;
  const unitCost = form.watch('unitCost') || 0;
  const totalCost = quantity * unitCost;

  const onSubmit = (data: FormValues) => {
    try {
      const expenseData = {
        itemName: data.itemName,
        quantity: data.quantity,
        unitCost: data.unitCost,
        totalCost: data.quantity * data.unitCost,
        date: data.date
      };

      if (isEditMode && expenseToEdit) {
        db.updateExpense(expenseToEdit.id, expenseData);
        toast({
          title: "Despesa atualizada",
          description: `${data.itemName} foi atualizado com sucesso.`,
        });
      } else {
        db.addExpense(expenseData);
        toast({
          title: "Despesa adicionada",
          description: `${data.itemName} foi adicionado com sucesso.`,
        });
      }
      
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Calculator size={32} className="text-primary" />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="itemName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Item</FormLabel>
              <FormControl>
                <Input placeholder="Nome do item" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={e => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unitCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Unitário (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                    onChange={e => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="p-4 bg-muted/30 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total:</span>
            <span className="text-lg font-semibold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(totalCost)}
            </span>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data da Compra</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal flex justify-between items-center",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <Calendar className="h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="submit">
            {isEditMode ? 'Salvar Alterações' : 'Adicionar Despesa'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddExpenseForm;
