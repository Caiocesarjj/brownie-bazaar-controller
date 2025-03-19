
import { Product } from '@/lib/database';
import React from 'react';
import { motion } from 'framer-motion';

interface StockStatusProps {
  products: Product[];
}

const StockStatus: React.FC<StockStatusProps> = ({ products }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="glass-effect rounded-xl overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium">Estoque Baixo</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Produtos com menos de 20 unidades
        </p>
      </div>
      
      <div className="divide-y">
        {products.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            Todos os produtos têm estoque suficiente
          </div>
        ) : (
          products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency(product.unitPrice)} por unidade
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {product.quantity} unidades
                  </div>
                  <div className="mt-2 h-1.5 w-24 bg-muted overflow-hidden rounded-full">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (product.quantity / 20) * 100)}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default StockStatus;
