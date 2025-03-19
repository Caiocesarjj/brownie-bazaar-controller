
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, Sale, Client, Reseller, Product } from '@/lib/database';
import { 
  Search, Plus, Trash2, FileText, ChevronLeft, ChevronRight, 
  ShoppingBag, CheckCircle, XCircle, DollarSign, Calendar, ChevronDown
} from 'lucide-react';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>(db.getSales());
  const [clients, setClients] = useState<Client[]>(db.getClients());
  const [resellers, setResellers] = useState<Reseller[]>(db.getResellers());
  const [products, setProducts] = useState<Product[]>(db.getProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSaleDialogOpen, setIsAddSaleDialogOpen] = useState(false);
  const [isSaleDetailsDialogOpen, setIsSaleDetailsDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // New sale form state
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedResellerId, setSelectedResellerId] = useState("");
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [currentProductId, setCurrentProductId] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredSales = sales.filter(sale => 
    sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sale.resellerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetNewSaleForm = () => {
    setSelectedClientId("");
    setSelectedResellerId("");
    setSaleItems([]);
    setCurrentProductId("");
    setCurrentQuantity(1);
    setErrors({});
  };

  const openAddSaleDialog = () => {
    setIsAddSaleDialogOpen(true);
    resetNewSaleForm();
  };

  const openSaleDetailsDialog = (sale: Sale) => {
    setSelectedSale(sale);
    setIsSaleDetailsDialogOpen(true);
  };

  const handleAddSaleItem = () => {
    if (!currentProductId) {
      setErrors({ ...errors, product: 'Selecione um produto' });
      return;
    }

    if (currentQuantity <= 0) {
      setErrors({ ...errors, quantity: 'A quantidade deve ser maior que zero' });
      return;
    }

    const product = products.find(p => p.id === currentProductId);
    if (!product) {
      setErrors({ ...errors, product: 'Produto não encontrado' });
      return;
    }

    if (currentQuantity > product.quantity) {
      setErrors({ ...errors, quantity: `Quantidade excede o estoque disponível (${product.quantity})` });
      return;
    }

    // Check if product already in cart
    const existingItemIndex = saleItems.findIndex(item => item.productId === currentProductId);
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...saleItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + currentQuantity;
      
      if (newQuantity > product.quantity) {
        setErrors({ ...errors, quantity: `Quantidade total excede o estoque disponível (${product.quantity})` });
        return;
      }
      
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity,
        subtotal: newQuantity * product.unitPrice
      };
      
      setSaleItems(updatedItems);
    } else {
      // Add new item
      setSaleItems([
        ...saleItems,
        {
          productId: product.id,
          productName: product.name,
          quantity: currentQuantity,
          unitPrice: product.unitPrice,
          subtotal: currentQuantity * product.unitPrice
        }
      ]);
    }

    // Reset selection
    setCurrentProductId("");
    setCurrentQuantity(1);
    setErrors({});
  };

  const handleRemoveSaleItem = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const handleSubmitSale = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!selectedClientId) {
      newErrors.client = 'Selecione um cliente';
    }
    
    if (!selectedResellerId) {
      newErrors.reseller = 'Selecione um revendedor';
    }
    
    if (saleItems.length === 0) {
      newErrors.items = 'Adicione pelo menos um produto';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Calculate total
    const totalAmount = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Find client and reseller
    const client = clients.find(c => c.id === selectedClientId);
    const reseller = resellers.find(r => r.id === selectedResellerId);
    
    if (!client || !reseller) {
      toast({
        title: "Erro",
        description: "Cliente ou revendedor não encontrado.",
        variant: "destructive",
      });
      return;
    }

    // Create sale
    try {
      const newSale: Omit<Sale, 'id'> = {
        clientId: client.id,
        clientName: client.name,
        resellerId: reseller.id,
        resellerName: reseller.name,
        items: saleItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        totalAmount,
        date: new Date()
      };
      
      db.addSale(newSale);
      setSales(db.getSales());
      setProducts(db.getProducts()); // Update products after inventory change
      
      toast({
        title: "Venda registrada",
        description: `Venda para ${client.name} registrada com sucesso.`,
      });
      
      setIsAddSaleDialogOpen(false);
      resetNewSaleForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a venda.",
        variant: "destructive",
      });
    }
  };

  // Filter available products (with stock)
  const availableProducts = products.filter(product => product.quantity > 0);

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
            <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
            <p className="text-muted-foreground mt-2">
              Registre e acompanhe suas vendas.
            </p>
          </div>
          <Button
            onClick={openAddSaleDialog}
            className="sm:self-start flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Nova Venda</span>
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <GlassCard className="mb-8 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar venda por cliente ou revendedor..."
              className="pl-9 pr-4 py-2 w-full rounded-md bg-background/50 border focus:ring-2 ring-primary/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </GlassCard>

        {/* Sales Table */}
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Revendedor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Valor Total</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                        Nenhuma venda encontrada.
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => (
                      <motion.tr 
                        key={sale.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">{sale.id}</td>
                        <td className="px-4 py-3">{sale.clientName}</td>
                        <td className="px-4 py-3">{sale.resellerName}</td>
                        <td className="px-4 py-3">
                          {format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {formatCurrency(sale.totalAmount)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openSaleDetailsDialog(sale)}
                            >
                              <FileText size={16} className="text-muted-foreground" />
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
                Mostrando {filteredSales.length} de {filteredSales.length} vendas
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

      {/* Add Sale Dialog */}
      <Dialog open={isAddSaleDialogOpen} onOpenChange={setIsAddSaleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nova Venda</DialogTitle>
            <DialogDescription>
              Registre uma nova venda de produtos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag size={32} className="text-primary" />
              </div>
            </div>
            
            {/* Client and Reseller Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Cliente</label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                  <SelectTrigger className={errors.client ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.client && <p className="text-xs text-destructive mt-1">{errors.client}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Revendedor</label>
                <Select value={selectedResellerId} onValueChange={setSelectedResellerId}>
                  <SelectTrigger className={errors.reseller ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione o revendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {resellers.map(reseller => (
                      <SelectItem key={reseller.id} value={reseller.id}>
                        {reseller.name} ({reseller.commission}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reseller && <p className="text-xs text-destructive mt-1">{errors.reseller}</p>}
              </div>
            </div>
            
            {/* Product Selection */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,100px] gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Produto</label>
                  <Select value={currentProductId} onValueChange={setCurrentProductId}>
                    <SelectTrigger className={errors.product ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.length === 0 ? (
                        <SelectItem disabled value="none">
                          Sem produtos em estoque
                        </SelectItem>
                      ) : (
                        availableProducts.map(product => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {formatCurrency(product.unitPrice)} ({product.quantity} em estoque)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.product && <p className="text-xs text-destructive mt-1">{errors.product}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Qtd.</label>
                  <input
                    type="number"
                    min="1"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(parseInt(e.target.value) || 0)}
                    className={`w-full px-3 py-2 rounded-md border ${errors.quantity ? "border-destructive" : "border-input"} focus:outline-none focus:ring-2 focus:ring-ring`}
                  />
                  {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity}</p>}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleAddSaleItem}
                className="w-full flex items-center justify-center gap-2"
                disabled={availableProducts.length === 0}
              >
                <Plus size={16} />
                <span>Adicionar Item</span>
              </Button>
              
              {errors.items && <p className="text-xs text-destructive mt-1">{errors.items}</p>}
            </div>
            
            {/* Sale Items */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted/40 px-4 py-2.5 border-b">
                <h4 className="font-medium text-sm">Itens da Venda</h4>
              </div>
              
              <div className="divide-y max-h-[250px] overflow-y-auto">
                {saleItems.length === 0 ? (
                  <div className="px-4 py-6 text-center text-muted-foreground">
                    Nenhum item adicionado
                  </div>
                ) : (
                  saleItems.map((item, index) => (
                    <div key={index} className="px-4 py-3 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {formatCurrency(item.subtotal)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveSaleItem(index)}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {saleItems.length > 0 && (
                <div className="bg-muted/40 px-4 py-3 border-t flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    {formatCurrency(saleItems.reduce((sum, item) => sum + item.subtotal, 0))}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSaleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitSale} disabled={saleItems.length === 0}>
              Registrar Venda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sale Details Dialog */}
      <Dialog open={isSaleDetailsDialogOpen} onOpenChange={setIsSaleDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Venda #{selectedSale?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedSale && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedSale.clientName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Revendedor</p>
                  <p className="font-medium">{selectedSale.resellerName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium flex items-center gap-1.5">
                    <Calendar size={14} />
                    {format(new Date(selectedSale.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="font-medium flex items-center gap-1.5">
                    <DollarSign size={14} />
                    {formatCurrency(selectedSale.totalAmount)}
                  </p>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/40 px-4 py-2.5 border-b flex items-center justify-between">
                  <h4 className="font-medium">Itens</h4>
                  <p className="text-xs text-muted-foreground">
                    {selectedSale.items.reduce((acc, item) => acc + item.quantity, 0)} produtos
                  </p>
                </div>
                <div className="divide-y">
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="px-4 py-3 flex justify-between">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="self-center font-medium">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/40 px-4 py-3 border-t flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">{formatCurrency(selectedSale.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sales;
