
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db, Expense } from '@/lib/database';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import AddExpenseForm from '@/components/forms/AddExpenseForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => db.getExpenses());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  const handleAddClick = () => {
    setSelectedExpense(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedExpense) {
      db.deleteExpense(selectedExpense.id);
      setExpenses(db.getExpenses());
      toast({
        title: "Despesa excluída",
        description: `${selectedExpense.itemName} foi excluído com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const refreshExpenses = () => {
    setExpenses(db.getExpenses());
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Despesas de Mercadoria</h1>
          <p className="text-muted-foreground mt-2">
            Gerenciar despesas com a compra de insumos e mercadorias.
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2">
          <PlusCircle size={18} />
          Nova Despesa
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-effect rounded-xl p-6"
      >
        <Table>
          <TableCaption>Lista de todas as despesas de mercadoria</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-right">Valor Unitário</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma despesa cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.itemName}</TableCell>
                  <TableCell className="text-right">{expense.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(expense.unitCost)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(expense.totalCost)}</TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(expense)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(expense)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedExpense ? 'Editar Despesa' : 'Adicionar Despesa'}
            </DialogTitle>
          </DialogHeader>
          <AddExpenseForm
            onSuccess={refreshExpenses}
            expenseToEdit={selectedExpense}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a excluir a despesa "{selectedExpense?.itemName}". 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Expenses;
