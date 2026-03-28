// График выручки — Area Chart
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { monthlyRevenue } from '../data/mockData';

interface RevenueChartProps {
  period: string;
}

// Кастомный tooltip с blur-фоном
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip-label">{label}</div>
      <div className="custom-tooltip-value">
        ₽{Math.round(payload[0].value).toLocaleString('ru-RU')}
      </div>
    </div>
  );
}

function RevenueChart({ period }: RevenueChartProps) {
  // Фильтрация данных по периоду
  let data = monthlyRevenue;
  if (period === '7d') data = monthlyRevenue.slice(-1);
  else if (period === '30d') data = monthlyRevenue.slice(-3);
  else if (period === '90d') data = monthlyRevenue.slice(-6);

  return (
    <div className="glass-card">
      <h3 className="chart-title">Динамика выручки</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={function (v: number) {
              return `${(v / 1000).toFixed(0)}к`;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{
              r: 6,
              fill: '#10b981',
              stroke: '#0a0e27',
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
