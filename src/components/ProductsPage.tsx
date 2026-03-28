// Страница продуктов — карточки с информацией о продуктах
import React from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  priceType: string; // "/мес" или разовая
  salesThisMonth: number;
  color: string;
}

const productsData: Product[] = [
  { id: 1, name: 'SaaS Подписка Pro', category: 'Подписка', price: 15000, priceType: '/мес', salesThisMonth: 124, color: 'var(--emerald)' },
  { id: 2, name: 'Консалтинг Enterprise', category: 'Услуги', price: 150000, priceType: '', salesThisMonth: 18, color: 'var(--purple)' },
  { id: 3, name: 'Лицензия Team', category: 'Подписка', price: 8000, priceType: '/мес', salesThisMonth: 256, color: 'var(--cyan)' },
  { id: 4, name: 'Обучение Corporate', category: 'Обучение', price: 45000, priceType: '', salesThisMonth: 42, color: 'var(--amber)' },
  { id: 5, name: 'Поддержка Premium', category: 'Подписка', price: 25000, priceType: '/мес', salesThisMonth: 89, color: 'var(--rose)' },
];

/* Форматирование цены */
function formatPrice(price: number, priceType: string): string {
  return '₽' + price.toLocaleString('ru-RU') + priceType;
}

interface ProductsPageProps {
  searchQuery: string;
}

function ProductsPage({ searchQuery }: ProductsPageProps) {
  const query = searchQuery.toLowerCase();

  const filtered = productsData.filter(function (p) {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-container animate-in">
      <h2 className="page-title">Продукты</h2>

      <div className="products-grid">
        {filtered.map(function (product) {
          /* Выручка за месяц */
          const revenue = product.price * product.salesThisMonth;
          return (
            <div key={product.id} className="glass-card product-card">
              {/* Цветная полоска сверху */}
              <div className="product-accent" style={{ background: product.color }} />
              <div className="product-category" style={{ color: product.color }}>{product.category}</div>
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">{formatPrice(product.price, product.priceType)}</div>
              <div className="product-stats">
                <div className="product-stat">
                  <span className="product-stat-label">Продаж/мес</span>
                  <span className="product-stat-value">{product.salesThisMonth}</span>
                </div>
                <div className="product-stat">
                  <span className="product-stat-label">Выручка/мес</span>
                  <span className="product-stat-value" style={{ color: 'var(--emerald)' }}>
                    {revenue >= 1000000
                      ? (revenue / 1000000).toFixed(1) + 'M ₽'
                      : (revenue / 1000).toFixed(0) + 'K ₽'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Ничего не найдено
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
