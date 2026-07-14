import React from 'react';
import { TrendingUp, Wallet2, Sparkles } from 'lucide-react';
import { formatCompactCurrency } from '../utils/format';

export default function PortfolioInsights({ snapshot, wallet }) {
  const items = [
    {
      label: 'Active positions',
      value: `${snapshot.totalStakedShares.toLocaleString()} shares`,
      icon: <TrendingUp size={16} color="var(--accent)" />,
    },
    {
      label: 'Projected annual income',
      value: `${formatCompactCurrency(snapshot.totalProjectedAnnualIncome)} USDC`,
      icon: <Sparkles size={16} color="var(--accent)" />,
    },
    {
      label: 'Wallet cash',
      value: `${formatCompactCurrency(wallet?.balanceUSDC || 0)} USDC`,
      icon: <Wallet2 size={16} color="var(--accent)" />,
    },
    {
      label: 'Best current yield',
      value: snapshot.topYieldName,
      icon: <TrendingUp size={16} color="var(--accent)" />,
    },
  ];

  return (
    <section className="glass-card portfolio-pulse" style={{ marginBottom: '32px', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <TrendingUp size={20} color="var(--accent)" />
        <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Portfolio Pulse</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {items.map((item) => (
          <div key={item.label} className="glass-card" style={{ padding: '16px', borderColor: 'var(--border-light)', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {item.icon}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', margin: 0 }}>{item.label}</p>
            </div>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
