import React from 'react';
import { cn } from '../lib/utils';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  className?: string;
}

export function MetricCard({ title, value, change, icon: Icon, trend, className }: MetricCardProps) {
  return (
    <div className={cn("bg-card p-6 rounded-lg border border-border", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground/60">{title}</h3>
        <Icon className="h-5 w-5 text-foreground/60" />
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        {change && (
          <span className={cn(
            "ml-2 text-sm",
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          )}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}