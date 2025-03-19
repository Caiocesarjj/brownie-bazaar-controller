
import React from 'react';
import { motion } from 'framer-motion';
import { Expense } from '@/lib/database';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CardTitle } from '@/components/ui/card';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <CardTitle className="text-lg font-medium mb-4">Despesas Recentes</CardTitle>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                Nenhuma despesa recente.
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.itemName}</TableCell>
                <TableCell className="text-right">{expense.quantity}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(expense.totalCost)}</TableCell>
                <TableCell>{formatDate(expense.date)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseSummary;
