import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

interface GraphProps {
  data: any[];
  title: string;
  className?: string;
}

export function Graph({ data, title, className }: GraphProps) {
  return (
    <div className={cn("bg-card p-6 rounded-lg border border-border", className)}>
      <h3 className="text-sm font-medium text-foreground/60 mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}