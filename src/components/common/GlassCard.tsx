
import { cn } from '@/lib/utils';
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  hoverEffect = false
}) => {
  return (
    <div 
      className={cn(
        "glass-effect rounded-xl overflow-hidden", 
        "transition-all duration-300 ease-in-out",
        hoverEffect && "hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
