// Карточки с ключевыми метриками и counter-анимацией
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface StatConfig {
  label: string;
  value: number;
  change: number;
  prefix: string;
  suffix: string;
  color: string;
  sparkData: number[];
}

const baseStats: StatConfig[] = [
  {
    label: 'Выручка',
    value: 12_847_500,
    change: 12.5,
    prefix: '₽',
    suffix: '',
    color: '#10b981',
    sparkData: [30, 40, 35, 50, 49, 60, 70, 65, 80, 75, 85, 90],
  },
  {
    label: 'Заказы',
    value: 1_847,
    change: 8.2,
    prefix: '',
    suffix: '',
    color: '#8b5cf6',
    sparkData: [20, 25, 22, 30, 28, 35, 40, 38, 45, 42, 48, 50],
  },
  {
    label: 'Клиенты',
    value: 12_493,
    change: 15.3,
    prefix: '',
    suffix: '',
    color: '#f59e0b',
    sparkData: [50, 52, 55, 58, 60, 63, 65, 68, 70, 74, 78, 82],
  },
  {
    label: 'Средний чек',
    value: 6_953,
    change: -2.1,
    prefix: '₽',
    suffix: '',
    color: '#f43f5e',
    sparkData: [45, 42, 44, 40, 43, 38, 41, 39, 37, 40, 36, 35],
  },
];

// Форматирование числа с пробелами (русский стиль)
function formatNumber(n: number): string {
  return Math.round(n).toLocaleString('ru-RU');
}

// Компонент одной карточки
function StatCard({ stat }: { stat: StatConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(function () {
    if (!isInView) return;

    const controls = animate(0, stat.value, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: function (v) {
        setDisplayValue(v);
      },
    });

    return function () {
      controls.stop();
    };
  }, [isInView, stat.value]);

  const sparkChartData = stat.sparkData.map(function (v, i) {
    return { v, i };
  });

  return (
    <motion.div
      ref={ref}
      className="glass-card stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="stat-card-header">
        <span className="stat-card-label">{stat.label}</span>
        <span
          className={`stat-card-badge ${stat.change >= 0 ? 'positive' : 'negative'}`}
        >
          {stat.change >= 0 ? '+' : ''}
          {stat.change}%
        </span>
      </div>
      <div className="stat-card-value" style={{ color: stat.color }}>
        {stat.prefix}
        {formatNumber(displayValue)}
        {stat.suffix}
      </div>
      <div className="stat-card-sparkline">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkChartData}>
            <defs>
              <linearGradient id={`spark-${stat.label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stat.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={stat.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={stat.color}
              strokeWidth={2}
              fill={`url(#spark-${stat.label})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

interface StatsCardsProps {
  period: string;
}

function StatsCards({ period }: StatsCardsProps) {
  const [stats, setStats] = useState(baseStats);

  // Коэффициенты по периодам
  const periodMultiplier = useCallback(function (p: string): number {
    switch (p) {
      case '7d': return 0.08;
      case '30d': return 0.35;
      case '90d': return 0.75;
      default: return 1;
    }
  }, []);

  // Real-time обновление каждые 8 секунд
  useEffect(function () {
    const mult = periodMultiplier(period);
    setStats(function () {
      return baseStats.map(function (s) {
        return { ...s, value: Math.round(s.value * mult) };
      });
    });
  }, [period, periodMultiplier]);

  useEffect(function () {
    const interval = setInterval(function () {
      setStats(function (prev) {
        const idx = Math.floor(Math.random() * prev.length);
        return prev.map(function (s, i) {
          if (i !== idx) return s;
          const delta = s.value * (Math.random() * 0.04 - 0.02);
          return { ...s, value: Math.round(s.value + delta) };
        });
      });
    }, 8000);

    return function () {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="stats-grid">
      {stats.map(function (stat) {
        return <StatCard key={stat.label} stat={stat} />;
      })}
    </div>
  );
}

export default StatsCards;
