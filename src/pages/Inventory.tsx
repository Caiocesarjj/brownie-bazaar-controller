
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db, Product } from '@/lib/database';
import { 
  Search, Plus, Trash2, Edit, ChevronLeft, ChevronRight, 
  Package, CheckCircle, XCircle, DollarSign, Archive 
} from 'lucide-react';
import AnimatedInput from '@/components/common/AnimatedInput';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>(db.getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddProductDialog = () => {
    setIsAddProductDialogOpen(true);
    setIsEditMode(false);
    setCurrentProduct(null);
    resetForm();
  };

  const openEditProductDialog = (product: Product) => {
    setCurrentProduct(product);
    setName(product.name);
    setQuantity(product.quantity.toString());
    setUnitPrice(product.unitPrice.toString());
    setIsEditMode(true);
    setIsAddProductDialogOpen(true);
  };

  const resetForm = () => {
    setName('');
    setQuantity('');
    setUnitPrice('');
    setErrors({});
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    if (!quantity.trim()) {
      newErrors.quantity = 'A quantidade é obrigatória';
    } else {
      const quantityValue = parseInt(quantity);
      if (isNaN(quantityValue) || quantityValue < 0) {
        newErrors.quantity = 'A quantidade deve ser um número positivo';
      }
    }
    
    if (!unitPrice.trim()) {
      newErrors.unitPrice = 'O preço unitário é obrigatório';
    } else {
      const priceValue = parseFloat(unitPrice);
      if (isNaN(priceValue) || priceValue <= 0) {
        newErrors.unitPrice = 'O preço unitário deve ser maior que zero';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    try {
      const quantityValue = parseInt(quantity);
      const priceValue = parseFloat(unitPrice);
      
      if (isEditMode && currentProduct) {
        // Update existing product
        db.updateProduct(currentProduct.id, { 
          name, 
          quantity: quantityValue,
          unitPrice: priceValue
        });
        setProducts(db.getProducts());
        toast({
          title: "Produto atualizado",
          description: `${name} foi atualizado com sucesso.`,
        });
      } else {
        // Add new product
        db.addProduct({ 
          name, 
          quantity: quantityValue,
          unitPrice: priceValue
        });
        setProducts(db.getProducts());
        toast({
          title: "Produto adicionado",
          description: `${name} foi adicionado com sucesso.`,
        });
      }
      
      setIsAddProductDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Preço Unitário</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data de Cadastro</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                        Nenhum produto encontrado.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
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
                        <td className="px-4 py-3">{formatCurrency(product.unitPrice)}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {format(new Date(product.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
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
                    ))
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
              {isEditMode ? 'Editar Produto' : 'Adicionar Produto'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Package size={32} className="text-primary" />
              </div>
            </div>
            
            <AnimatedInput
              id="name"
              label="Nome do Produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <AnimatedInput
                  id="quantity"
                  label="Quantidade"
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  error={errors.quantity}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Archive size={16} />
                </div>
              </div>
              
              <div className="relative">
                <AnimatedInput
                  id="unitPrice"
                  label="Preço Unitário"
                  type="number"
                  min="0"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  error={errors.unitPrice}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <DollarSign size={16} />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {isEditMode ? 'Salvar Alterações' : 'Adicionar Produto'}
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
