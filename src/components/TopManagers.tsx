// Блок топ-менеджеров с прогресс-барами
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { managers } from '../data/mockData';

function TopManagers() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  // Получить инициалы из имени
  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(function (w) { return w[0]; })
      .join('');
  }

  return (
    <div className="glass-card" ref={ref}>
      <h3 className="chart-title">Лучшие менеджеры</h3>
      <div className="managers-grid">
        {managers.map(function (mgr, idx) {
          const pct = Math.round((mgr.sales / mgr.target) * 100);

          return (
            <motion.div
              key={mgr.name}
              className="manager-card"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div
                className="manager-avatar"
                style={{ background: `${mgr.color}22`, color: mgr.color }}
              >
                {getInitials(mgr.name)}
              </div>
              <div className="manager-info">
                <div className="manager-name">{mgr.name}</div>
                <div className="manager-stats">
                  ₽{mgr.sales.toLocaleString('ru-RU')} / {mgr.deals} сделок
                </div>
                <div className="manager-progress">
                  <motion.div
                    className="manager-progress-bar"
                    style={{ background: mgr.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${Math.min(pct, 100)}%` } : {}}
                    transition={{ duration: 1, delay: idx * 0.1 + 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default TopManagers;
