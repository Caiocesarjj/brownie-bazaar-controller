
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db, Reseller } from '@/lib/database';
import { 
  Search, Plus, Trash2, Edit, ChevronLeft, ChevronRight, 
  UserRound, CheckCircle, XCircle, Percent 
} from 'lucide-react';
import AnimatedInput from '@/components/common/AnimatedInput';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Resellers = () => {
  const [resellers, setResellers] = useState<Reseller[]>(db.getResellers());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddResellerDialogOpen, setIsAddResellerDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resellerToDelete, setResellerToDelete] = useState<Reseller | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentReseller, setCurrentReseller] = useState<Reseller | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [commission, setCommission] = useState('15');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredResellers = resellers.filter(reseller => 
    reseller.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reseller.phone.includes(searchTerm)
  );

  const openAddResellerDialog = () => {
    setIsAddResellerDialogOpen(true);
    setIsEditMode(false);
    setCurrentReseller(null);
    resetForm();
  };

  const openEditResellerDialog = (reseller: Reseller) => {
    setCurrentReseller(reseller);
    setName(reseller.name);
    setPhone(reseller.phone);
    setCommission(reseller.commission.toString());
    setIsEditMode(true);
    setIsAddResellerDialogOpen(true);
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setCommission('15');
    setErrors({});
  };

  const openDeleteDialog = (reseller: Reseller) => {
    setResellerToDelete(reseller);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'O telefone é obrigatório';
    } else if (!/^[\d\s()-]+$/.test(phone)) {
      newErrors.phone = 'Formato de telefone inválido';
    }
    
    if (!commission.trim()) {
      newErrors.commission = 'A comissão é obrigatória';
    } else {
      const commissionValue = parseFloat(commission);
      if (isNaN(commissionValue) || commissionValue < 0 || commissionValue > 100) {
        newErrors.commission = 'A comissão deve ser um valor entre 0 e 100';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    try {
      const commissionValue = parseFloat(commission);
      
      if (isEditMode && currentReseller) {
        // Update existing reseller
        db.updateReseller(currentReseller.id, { 
          name, 
          phone,
          commission: commissionValue 
        });
        setResellers(db.getResellers());
        toast({
          title: "Revendedor atualizado",
          description: `${name} foi atualizado com sucesso.`,
        });
      } else {
        // Add new reseller
        db.addReseller({ 
          name, 
          phone,
          commission: commissionValue 
        });
        setResellers(db.getResellers());
        toast({
          title: "Revendedor adicionado",
          description: `${name} foi adicionado com sucesso.`,
        });
      }
      
      setIsAddResellerDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReseller = () => {
    if (resellerToDelete) {
      try {
        db.deleteReseller(resellerToDelete.id);
        setResellers(db.getResellers());
        toast({
          title: "Revendedor removido",
          description: `${resellerToDelete.name} foi removido com sucesso.`,
        });
        setIsDeleteDialogOpen(false);
        setResellerToDelete(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao remover o revendedor.",
          variant: "destructive",
        });
      }
    }
  };

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
            <h1 className="text-3xl font-bold tracking-tight">Revendedores</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus revendedores e suas comissões.
            </p>
          </div>
          <Button
            onClick={openAddResellerDialog}
            className="sm:self-start flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Novo Revendedor</span>
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <GlassCard className="mb-8 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar revendedor por nome ou telefone..."
              className="pl-9 pr-4 py-2 w-full rounded-md bg-background/50 border focus:ring-2 ring-primary/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </GlassCard>

        {/* Resellers Table */}
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Comissão</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data de Cadastro</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredResellers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                        Nenhum revendedor encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredResellers.map((reseller) => (
                      <motion.tr 
                        key={reseller.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">{reseller.name}</td>
                        <td className="px-4 py-3">{reseller.phone}</td>
                        <td className="px-4 py-3">{reseller.commission}%</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {format(new Date(reseller.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditResellerDialog(reseller)}
                            >
                              <Edit size={16} className="text-muted-foreground" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteDialog(reseller)}
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
                Mostrando {filteredResellers.length} de {filteredResellers.length} revendedores
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

      {/* Add/Edit Reseller Dialog */}
      <Dialog open={isAddResellerDialogOpen} onOpenChange={setIsAddResellerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Editar Revendedor' : 'Adicionar Revendedor'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserRound size={32} className="text-primary" />
              </div>
            </div>
            
            <AnimatedInput
              id="name"
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            
            <AnimatedInput
              id="phone"
              label="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />
            
            <div className="relative">
              <AnimatedInput
                id="commission"
                label="Comissão (%)"
                type="number"
                min="0"
                max="100"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                error={errors.commission}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Percent size={16} />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddResellerDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? 'Salvar Alterações' : 'Adicionar Revendedor'}
            </Button>
          </DialogFooter>
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
              Tem certeza que deseja excluir o revendedor <strong>{resellerToDelete?.name}</strong>?
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
                onClick={handleDeleteReseller}
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

export default Resellers;
