import React from 'react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: '⊞', label: 'Dashboard', active: true },
  { icon: '◈', label: 'Analytics', active: false },
  { icon: '⇄', label: 'Transactions', active: false },
  { icon: '◉', label: 'Team', active: false },
  { icon: '⚙', label: 'Settings', active: false },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        className="sidebar"
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="sidebar-header">
          <motion.div
            className="sidebar-logo"
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
          >
            <span className="logo-icon">◆</span>
            {!collapsed && <span className="logo-text">SalesDash</span>}
          </motion.div>
          <button className="sidebar-toggle" onClick={onToggle}>
            {collapsed ? '▸' : '◂'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.label}
              className={`sidebar-item ${item.active ? 'active' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              title={item.label}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`bottom-nav-item ${item.active ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
