
import React, { useState } from 'react';
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
import { UserRound, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome deve ter pelo menos 3 caracteres.',
  }),
  phone: z.string().min(8, {
    message: 'O telefone deve ter pelo menos 8 caracteres.',
  }).refine(val => /^[\d\s()-]+$/.test(val), {
    message: 'Formato de telefone inválido.',
  }),
  paymentDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddClientFormProps {
  onSuccess?: () => void;
  clientToEdit?: {
    id: string;
    name: string;
    phone: string;
    paymentDate?: Date;
  } | null;
}

const AddClientForm: React.FC<AddClientFormProps> = ({
  onSuccess,
  clientToEdit = null,
}) => {
  const isEditMode = !!clientToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: clientToEdit?.name || '',
      phone: clientToEdit?.phone || '',
      paymentDate: clientToEdit?.paymentDate,
    },
  });

  const onSubmit = (data: FormValues) => {
    try {
      if (isEditMode && clientToEdit) {
        db.updateClient(clientToEdit.id, data);
        toast({
          title: "Cliente atualizado",
          description: `${data.name} foi atualizado com sucesso.`,
        });
      } else {
        // Make sure we have all required properties for the client
        const clientData = {
          name: data.name,
          phone: data.phone,
          paymentDate: data.paymentDate
        };
        db.addClient(clientData);
        toast({
          title: "Cliente adicionado",
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
            <UserRound size={32} className="text-primary" />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 0000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Pagamento Mensal</FormLabel>
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
                        format(field.value, "dd 'de' MMMM", { locale: ptBR })
                      ) : (
                        <span>Definir dia do pagamento</span>
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
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button type="submit">
            {isEditMode ? 'Salvar Alterações' : 'Adicionar Cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddClientForm;
