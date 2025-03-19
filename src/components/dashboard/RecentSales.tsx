
import { Sale } from '@/lib/database';
import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentSalesProps {
  sales: Sale[];
}

const RecentSales: React.FC<RecentSalesProps> = ({ sales }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="glass-effect rounded-xl overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium">Vendas Recentes</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Últimas vendas registradas no sistema
        </p>
      </div>
      
      <motion.div 
        className="divide-y"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {sales.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            Nenhuma venda recente
          </div>
        ) : (
          sales.map((sale) => (
            <motion.div 
              key={sale.id}
              variants={item}
              className="p-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{sale.clientName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Via {sale.resellerName} • {formatDistanceToNow(new Date(sale.date), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </p>
                  <div className="mt-2 space-y-1">
                    {sale.items.map((item, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground">
                        {item.quantity}× {item.productName}
                      </p>
                    ))}
                  </div>
                </div>
                <p className="font-medium text-right">
                  {formatCurrency(sale.totalAmount)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default RecentSales;
