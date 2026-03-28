import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

interface StatsCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  index: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, prefix = '', suffix = '', change, index }) => {
  const animatedValue = useCountUp(value);
  const isPositive = change >= 0;

  const formatValue = (v: number) => {
    if (prefix === '$' && v >= 1000) {
      return prefix + v.toLocaleString('en-US', { minimumFractionDigits: v % 1 !== 0 ? 2 : 0, maximumFractionDigits: 2 });
    }
    if (v >= 1000) {
      return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    return prefix + v.toFixed(v % 1 !== 0 ? 2 : 0) + suffix;
  };

  return (
    <motion.div
      className="stats-card glass-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="stats-card-header">
        <span className="stats-label">{label}</span>
        <span className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      </div>
      <div className="stats-value">
        {formatValue(animatedValue)}
      </div>
    </motion.div>
  );
};

export default StatsCard;
