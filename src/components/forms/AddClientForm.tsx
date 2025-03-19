
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
import { UserRound } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome deve ter pelo menos 3 caracteres.',
  }),
  phone: z.string().min(8, {
    message: 'O telefone deve ter pelo menos 8 caracteres.',
  }).refine(val => /^[\d\s()-]+$/.test(val), {
    message: 'Formato de telefone inválido.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddClientFormProps {
  onSuccess?: () => void;
  clientToEdit?: {
    id: string;
    name: string;
    phone: string;
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
        db.addClient(data);
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
