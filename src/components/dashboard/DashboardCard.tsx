
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  trendValue,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={cn(
        "glass-effect rounded-xl p-6",
        "transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-3 flex items-baseline">
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
            {trend && trendValue && (
              <span className={cn(
                "ml-2 text-xs font-medium",
                trend === 'up' ? "text-green-500" : 
                trend === 'down' ? "text-red-500" : 
                "text-muted-foreground"
              )}>
                {trendValue}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="rounded-full p-2.5 bg-primary/10">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
