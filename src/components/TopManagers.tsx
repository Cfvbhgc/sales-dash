import React from 'react';
import { motion } from 'framer-motion';
import { managers } from '../data/mockData';

const TopManagers: React.FC = () => {
  return (
    <motion.div
      className="managers-container glass-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      <h3 className="section-title">Top Managers</h3>
      <div className="managers-list">
        {managers.map((m, i) => {
          const pct = Math.round((m.sales / m.target) * 100);
          return (
            <motion.div
              key={m.name}
              className="manager-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="manager-avatar" style={{ background: m.color }}>
                {m.initials}
              </div>
              <div className="manager-info">
                <div className="manager-name">{m.name}</div>
                <div className="manager-sales">${m.sales.toLocaleString()}</div>
                <div className="manager-bar-track">
                  <motion.div
                    className="manager-bar-fill"
                    style={{ background: m.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                  />
                </div>
                <div className="manager-pct">{pct}% of target</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TopManagers;
