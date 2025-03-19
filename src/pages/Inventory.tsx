
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db, Product } from '@/lib/database';
import { 
  Search, Plus, Trash2, Edit, ChevronLeft, ChevronRight, 
  CheckCircle, XCircle, TrendingUp
} from 'lucide-react';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AddProductForm from '@/components/forms/AddProductForm';

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>(db.getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddProductDialog = () => {
    setIsAddProductDialogOpen(true);
    setCurrentProduct(null);
  };

  const openEditProductDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsAddProductDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      try {
        db.deleteProduct(productToDelete.id);
        setProducts(db.getProducts());
        toast({
          title: "Produto removido",
          description: `${productToDelete.name} foi removido com sucesso.`,
        });
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao remover o produto.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormSuccess = () => {
    setProducts(db.getProducts());
    setIsAddProductDialogOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateProfit = (unitPrice: number, costPrice: number) => {
    const profit = unitPrice - costPrice;
    const profitMargin = (profit / unitPrice) * 100;
    return {
      profit,
      profitMargin
    };
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
            <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seu estoque de produtos e preços.
            </p>
          </div>
          <Button
            onClick={openAddProductDialog}
            className="sm:self-start flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Novo Produto</span>
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <GlassCard className="mb-8 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar produto por nome..."
              className="pl-9 pr-4 py-2 w-full rounded-md bg-background/50 border focus:ring-2 ring-primary/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </GlassCard>

        {/* Products Table */}
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quantidade</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Preço de Custo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Preço de Venda</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Lucro</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Margem %</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const { profit, profitMargin } = calculateProfit(product.unitPrice, product.costPrice);
                      return (
                        <motion.tr 
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{product.quantity} unidades</td>
                          <td className="px-4 py-3">{formatCurrency(product.costPrice)}</td>
                          <td className="px-4 py-3">{formatCurrency(product.unitPrice)}</td>
                          <td className="px-4 py-3">{formatCurrency(profit)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <TrendingUp size={16} className={profitMargin > 30 ? "text-green-500 mr-1" : "text-amber-500 mr-1"} />
                              {profitMargin.toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`
                              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${product.quantity > 20 ? 'bg-green-100 text-green-800' : 
                                product.quantity > 5 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}
                            `}>
                              {product.quantity > 20 ? 'Normal' : 
                               product.quantity > 5 ? 'Baixo' : 
                               'Crítico'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openEditProductDialog(product)}
                              >
                                <Edit size={16} className="text-muted-foreground" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openDeleteDialog(product)}
                              >
                                <Trash2 size={16} className="text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredProducts.length} de {filteredProducts.length} produtos
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </DialogTitle>
          </DialogHeader>
          
          <AddProductForm 
            onSuccess={handleFormSuccess}
            productToEdit={currentProduct}
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
              Tem certeza que deseja excluir o produto <strong>{productToDelete?.name}</strong>?
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
                onClick={handleDeleteProduct}
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

export default Inventory;
