// Страница аналитики — графики Recharts
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

/* Данные воронки продаж */
const funnelData = [
  { stage: 'Лиды', value: 1200 },
  { stage: 'Квалификация', value: 680 },
  { stage: 'Предложение', value: 320 },
  { stage: 'Сделка', value: 145 },
];

/* Конверсия по месяцам */
const conversionData = [
  { month: 'Окт', conversion: 9.2 },
  { month: 'Ноя', conversion: 10.5 },
  { month: 'Дек', conversion: 11.8 },
  { month: 'Янв', conversion: 10.1 },
  { month: 'Фев', conversion: 12.4 },
  { month: 'Мар', conversion: 13.2 },
];

/* Топ менеджеров по выручке */
const managersData = [
  { name: 'Волков А.', revenue: 4200 },
  { name: 'Петрова М.', revenue: 3800 },
  { name: 'Козлов Д.', revenue: 3100 },
  { name: 'Иванова Е.', revenue: 2700 },
  { name: 'Сидоров И.', revenue: 2200 },
];

/* Продажи по регионам */
const regionsData = [
  { name: 'Москва', value: 35 },
  { name: 'СПб', value: 20 },
  { name: 'Екатеринбург', value: 12 },
  { name: 'Новосибирск', value: 10 },
  { name: 'Другие', value: 23 },
];

const REGION_COLORS = ['#10b981', '#8b5cf6', '#06b6d4', '#f59e0b', '#f43f5e'];

/* Кастомный тултип */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip-label">{label}</div>
      <div className="custom-tooltip-value">{payload[0].value}</div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="page-container animate-in">
      <h2 className="page-title">Аналитика</h2>

      <div className="analytics-grid">
        {/* Воронка продаж — горизонтальный BarChart */}
        <div className="glass-card">
          <div className="chart-title">Воронка продаж</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="var(--text-muted)" />
              <YAxis type="category" dataKey="stage" stroke="var(--text-muted)" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="var(--emerald)" radius={[0, 6, 6, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Конверсия по месяцам — LineChart */}
        <div className="glass-card">
          <div className="chart-title">Конверсия по месяцам, %</div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={conversionData} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" domain={[0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="conversion"
                stroke="var(--purple)"
                strokeWidth={3}
                dot={{ fill: 'var(--purple)', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Топ менеджеров — BarChart вертикальный */}
        <div className="glass-card">
          <div className="chart-title">Топ менеджеров (выручка, тыс. ₽)</div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={managersData} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="var(--cyan)" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Продажи по регионам — PieChart */}
        <div className="glass-card">
          <div className="chart-title">Продажи по регионам</div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={regionsData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                dataKey="value"
                nameKey="name"
                label={function (entry: any) { return entry.name + ' ' + entry.value + '%'; }}
                labelLine={{ stroke: 'var(--text-muted)' }}
              >
                {regionsData.map(function (_entry, index) {
                  return <Cell key={index} fill={REGION_COLORS[index]} />;
                })}
              </Pie>
              <Tooltip />
              <Legend
                wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '13px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
