
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, Client } from '@/lib/database';
import { 
  Search, Plus, Trash2, Edit, ChevronLeft, ChevronRight, 
  CheckCircle, XCircle 
} from 'lucide-react';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AddClientForm from '@/components/forms/AddClientForm';
import { useAsyncData } from '@/lib/utils/AsyncDataHelper';

const Clients = () => {
  const { data: clients = [], loading, refetch: refreshClients } = useAsyncData<Client[]>(() => db.getClients());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.phone.includes(searchTerm)
  );

  const openAddClientDialog = () => {
    setIsAddClientDialogOpen(true);
    setCurrentClient(null);
  };

  const openEditClientDialog = (client: Client) => {
    setCurrentClient(client);
    setIsAddClientDialogOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClient = async () => {
    if (clientToDelete) {
      try {
        await db.deleteClient(clientToDelete.id);
        await refreshClients();
        toast({
          title: "Cliente removido",
          description: `${clientToDelete.name} foi removido com sucesso.`,
        });
        setIsDeleteDialogOpen(false);
        setClientToDelete(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao remover o cliente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormSuccess = async () => {
    await refreshClients();
    setIsAddClientDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-10 px-6 flex justify-center items-center">
        <p>Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus clientes e suas informações de contato.
            </p>
          </div>
          <Button
            onClick={openAddClientDialog}
            className="sm:self-start flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Novo Cliente</span>
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <GlassCard className="mb-8 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar cliente por nome ou telefone..."
              className="pl-9 pr-4 py-2 w-full rounded-md bg-background/50 border focus:ring-2 ring-primary/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </GlassCard>

        {/* Clients Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Telefone</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data de Cadastro</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <motion.tr 
                        key={client.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">{client.name}</td>
                        <td className="px-4 py-3">{client.phone}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {format(new Date(client.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditClientDialog(client)}
                            >
                              <Edit size={16} className="text-muted-foreground" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteDialog(client)}
                            >
                              <Trash2 size={16} className="text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredClients.length} de {filteredClients.length} clientes
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft size={16} />
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Add/Edit Client Dialog */}
      <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentClient ? 'Editar Cliente' : 'Adicionar Cliente'}
            </DialogTitle>
          </DialogHeader>
          
          <AddClientForm 
            onSuccess={handleFormSuccess}
            clientToEdit={currentClient}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-center mb-6">
              Tem certeza que deseja excluir o cliente <strong>{clientToDelete?.name}</strong>?
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex items-center gap-2"
              >
                <XCircle size={16} />
                <span>Cancelar</span>
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteClient}
                className="flex items-center gap-2"
              >
                <CheckCircle size={16} />
                <span>Confirmar</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
