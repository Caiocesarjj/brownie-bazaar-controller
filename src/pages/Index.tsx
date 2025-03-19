
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { db } from '@/lib/database';
import { 
  Users, UserRound, Package, DollarSign, TrendingUp, ShoppingBag, 
  CreditCard, PiggyBank
} from 'lucide-react';
import RecentSales from '@/components/dashboard/RecentSales';
import StockStatus from '@/components/dashboard/StockStatus';
import ExpenseSummary from '@/components/dashboard/ExpenseSummary';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Index = () => {
  const [dashboardData, setDashboardData] = React.useState(() => db.getDashboardData());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Sample data for the chart
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Fev', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Abr', value: 2780 },
    { name: 'Mai', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Bem-vindo ao seu sistema de controle de vendas de brownies.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard 
            title="Total de Clientes"
            value={dashboardData.totalClients}
            icon={<Users size={20} className="text-primary" />}
            trend="up"
            trendValue="+12.5%"
          />
          <DashboardCard 
            title="Total de Revendedores"
            value={dashboardData.totalResellers}
            icon={<UserRound size={20} className="text-primary" />}
          />
          <DashboardCard 
            title="Vendas do Mês"
            value={dashboardData.monthlySales}
            icon={<ShoppingBag size={20} className="text-primary" />}
            trend="up"
            trendValue="+18.2%"
          />
          <DashboardCard 
            title="Receita do Mês"
            value={formatCurrency(dashboardData.monthlyRevenue)}
            icon={<DollarSign size={20} className="text-primary" />}
            trend="up"
            trendValue="+22.5%"
          />
        </div>

        {/* Profit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Despesas do Mês"
            value={formatCurrency(dashboardData.monthlyExpensesTotal)}
            icon={<CreditCard size={20} className="text-primary" />}
          />
          <DashboardCard 
            title="Lucro do Mês"
            value={formatCurrency(dashboardData.monthlyProfit)}
            icon={<PiggyBank size={20} className="text-primary" />}
            trend={dashboardData.monthlyProfit > 0 ? "up" : "down"}
            trendValue={`${dashboardData.monthlyProfit > 0 ? '+' : ''}${Math.round((dashboardData.monthlyProfit / dashboardData.monthlyRevenue) * 100)}%`}
          />
          <DashboardCard 
            title="Margem de Lucro"
            value={`${Math.round((dashboardData.monthlyProfit / dashboardData.monthlyRevenue) * 100)}%`}
            icon={<TrendingUp size={20} className="text-primary" />}
          />
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-medium mb-4">Visão Geral de Vendas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`R$${value}`, 'Vendas']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Sales, Stock Status, and Expense Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <RecentSales sales={dashboardData.recentSales} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <StockStatus products={dashboardData.lowStockProducts} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-1"
          >
            <ExpenseSummary expenses={dashboardData.recentExpenses} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
