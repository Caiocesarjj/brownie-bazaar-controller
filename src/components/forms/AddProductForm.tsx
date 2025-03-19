
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
import { Package, DollarSign, Archive, TrendingUp } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome deve ter pelo menos 3 caracteres.',
  }),
  quantity: z.coerce.number().min(0, {
    message: 'A quantidade deve ser um número positivo.',
  }),
  unitPrice: z.coerce.number().min(0.01, {
    message: 'O preço de venda deve ser maior que zero.',
  }),
  costPrice: z.coerce.number().min(0.01, {
    message: 'O preço de custo deve ser maior que zero.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddProductFormProps {
  onSuccess?: () => void;
  productToEdit?: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    costPrice: number;
  } | null;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  onSuccess,
  productToEdit = null,
}) => {
  const isEditMode = !!productToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: productToEdit?.name || '',
      quantity: productToEdit?.quantity || 0,
      unitPrice: productToEdit?.unitPrice || 0,
      costPrice: productToEdit?.costPrice || 0,
    },
  });

  const calculateProfit = () => {
    const unitPrice = form.watch('unitPrice');
    const costPrice = form.watch('costPrice');
    
    if (unitPrice && costPrice) {
      const profit = unitPrice - costPrice;
      const profitMargin = (profit / unitPrice) * 100;
      return {
        profit: profit.toFixed(2),
        profitMargin: profitMargin.toFixed(2)
      };
    }
    
    return { profit: '0.00', profitMargin: '0.00' };
  };

  const { profit, profitMargin } = calculateProfit();

  const onSubmit = (data: FormValues) => {
    try {
      if (isEditMode && productToEdit) {
        db.updateProduct(productToEdit.id, data);
        toast({
          title: "Produto atualizado",
          description: `${data.name} foi atualizado com sucesso.`,
        });
      } else {
        // Make sure we have all required properties for the product
        const productData = {
          name: data.name,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          costPrice: data.costPrice
        };
        db.addProduct(productData);
        toast({
          title: "Produto adicionado",
          description: `${data.name} foi adicionado com sucesso.`,
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
            <Package size={32} className="text-primary" />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
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
                  <div className="relative">
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="Quantidade em estoque" 
                      {...field} 
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <Archive size={16} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Custo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      min="0.01" 
                      step="0.01"
                      placeholder="0,00" 
                      {...field} 
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <DollarSign size={16} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Venda</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="number" 
                      min="0.01" 
                      step="0.01"
                      placeholder="0,00" 
                      {...field} 
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      <DollarSign size={16} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Profit Display */}
          <div className="md:col-span-2 p-4 rounded-md bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-primary" />
              <h3 className="text-sm font-medium">Cálculo do Lucro</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs text-muted-foreground">Lucro por unidade</p>
                <p className="text-base font-medium">R$ {profit}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Margem de lucro</p>
                <p className="text-base font-medium">{profitMargin}%</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="submit">
            {isEditMode ? 'Salvar Alterações' : 'Adicionar Produto'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddProductForm;
