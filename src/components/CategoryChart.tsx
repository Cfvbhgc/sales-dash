import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { categoryData } from '../data/mockData';

const CategoryChart: React.FC = () => {
  return (
    <motion.div
      className="chart-container glass-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <h3 className="section-title">Sales by Category</h3>
      <div className="category-chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1a1d27',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#e2e8f0',
              }}
              formatter={(value: any) => [`${value}%`, 'Share']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="category-legend">
          {categoryData.map((cat) => (
            <div key={cat.name} className="legend-item">
              <span className="legend-dot" style={{ background: cat.color }} />
              <span className="legend-name">{cat.name}</span>
              <span className="legend-value">{cat.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryChart;
