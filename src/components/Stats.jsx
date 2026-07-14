import React, { useMemo } from 'react';
import { Home, Users, DollarSign, Percent, Wallet2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/format';

export default function Stats({ totalDividends, totalStaked, wallet = {} }) {
  const statItems = useMemo(() => [
    {
      title: 'Properties Tokenized',
      value: '3 Commercial',
      icon: <Home size={20} color="var(--primary-cyan)" />,
      description: 'Fully audited assets',
    },
    {
      title: 'Total Staked Shares',
      value: `${(totalStaked).toLocaleString()} PROP`,
      icon: <Users size={20} color="var(--primary-cyan)" />,
      description: 'Active property shares',
    },
    {
      title: 'Dividends Distributed',
      value: `${formatCurrency(totalDividends)} USDC`,
      icon: <DollarSign size={20} color="var(--primary-purple)" />,
      description: 'Proportional payout total',
    },
    {
      title: 'Wallet Ready',
      value: wallet.connected ? `${formatCurrency(wallet.balanceUSDC)} USDC` : 'Connect Wallet',
      icon: <Wallet2 size={20} color="var(--accent-green)" />,
      description: wallet.connected ? 'Ready to deploy funds' : 'Secure your first investment',
    },
  ], [totalDividends, totalStaked, wallet.balanceUSDC, wallet.connected]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    }}>
      {statItems.map((item, index) => (
        <div key={index} className="glass-card glow-card-purple" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-light)'
          }}>
            {item.icon}
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              {item.title}
            </p>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '2px' }}>
              {item.value}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
