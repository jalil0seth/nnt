import React from 'react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdvancedMetricsProps {
  data: any[];
  title: string;
  className?: string;
}

export function AdvancedMetrics({ data, title, className }: AdvancedMetricsProps) {
  return (
    <div className={cn("bg-card p-6 rounded-lg border border-border", className)}>
      <h3 className="text-sm font-medium text-foreground/60 mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
            <XAxis 
              dataKey="name" 
              stroke="#E2E8F0" 
              tick={{ fill: '#E2E8F0' }}
            />
            <YAxis 
              stroke="#E2E8F0"
              tick={{ fill: '#E2E8F0' }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1A1F2E',
                border: '1px solid #2D3748',
                borderRadius: '6px',
                color: '#E2E8F0'
              }}
            />
            <Bar dataKey="organic" stackId="a" fill="#3B82F6" />
            <Bar dataKey="paid" stackId="a" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}