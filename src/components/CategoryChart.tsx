// Круговая диаграмма категорий продаж
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { categories } from '../data/mockData';

function CategoryChart() {
  return (
    <div className="glass-card">
      <h3 className="chart-title">Категории продаж</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={categories}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {categories.map(function (entry, index) {
              return <Cell key={index} fill={entry.color} />;
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="category-legend">
        {categories.map(function (cat) {
          return (
            <div key={cat.name} className="category-legend-item">
              <span
                className="category-legend-dot"
                style={{ backgroundColor: cat.color }}
              />
              <span className="category-legend-name">{cat.name}</span>
              <span className="category-legend-value">{cat.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryChart;
