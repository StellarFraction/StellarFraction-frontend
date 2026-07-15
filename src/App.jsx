import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Stats from './components/Stats';
import PropertyCard from './components/PropertyCard';
import InvestmentCalculator from './components/InvestmentCalculator';
import StellarWorkflow from './components/StellarWorkflow';
import SorobanPlayground from './components/SorobanPlayground';
import WatchlistComparison from './components/WatchlistComparison';
import PortfolioInsights from './components/PortfolioInsights';
import { INITIAL_PROPERTIES } from './data/properties';
import { DEFAULT_WATCHLIST, WATCHLIST_STORAGE_KEY } from './constants/watchlist';
import { usePersistentState } from './hooks/usePersistentState';
import { pruneUnavailableWatchlistIds, toggleWatchlistId } from './utils/properties';
import { calculatePendingReward } from './utils/math';
import { Github, ArrowUpRight, Terminal, GitFork, Cpu, BookOpen, Star } from 'lucide-react';

// ── Page Components ────────────────────────────────────────────────────────────

function PropertiesPage({
  properties, wallet, watchlistIds,
  onToggleWatchlist, onClearWatchlist, onInvest, onWithdrawShares,
  totalDividends, totalShares
}) {
  const [filter, setFilter] = useState('all');

  const filtered = properties.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'available') return p.availableShares > 0;
    if (filter === 'invested') return p.userShares > 0;
    return true;
  });

  return (
    <div>
      <div className="section-header">
        <h2>Property Catalog</h2>
        <p>Fractional deed tokens yielding USDC rental income on Stellar.</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: 32 }}>
        <div className="stat-block">
          <div className="stat-label">Total Value Locked</div>
          <div className="stat-value">${(totalShares * 1).toLocaleString()}</div>
          <div className="stat-sub">across {properties.length} properties</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Distributions Paid</div>
          <div className="stat-value">${totalDividends.toLocaleString()}</div>
          <div className="stat-sub">USDC distributed to stakers</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Active Pools</div>
          <div className="stat-value">{properties.length}</div>
          <div className="stat-sub">property pools live on testnet</div>
        </div>
        <div className="stat-block">
          <div className="stat-label">Network</div>
          <div className="stat-value" style={{ fontSize: '1rem', paddingTop: 6 }}>Stellar</div>
          <div className="stat-sub">Soroban smart contracts</div>
        </div>
      </div>

      <div className="filter-bar">
        {['all', 'available', 'invested'].map(f => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <PropertyCard
        properties={filtered}
        wallet={wallet}
        watchlistIds={watchlistIds}
        onToggleWatchlist={onToggleWatchlist}
        onClearWatchlist={onClearWatchlist}
        onInvest={onInvest}
        onWithdrawShares={onWithdrawShares}
      />
    </div>
  );
}

function PortfolioPage({ properties, watchlistIds, wallet }) {
  const invested = properties.filter(p => p.userShares > 0);
  const totalInvested = invested.reduce((s, p) => s + p.userShares, 0);

  return (
    <div>
      <div className="section-header">
        <h2>Your Portfolio</h2>
        <p>Track your positions, pending rewards, and watchlist comparisons.</p>
      </div>

      {!wallet.connected && (
        <div className="empty-state">
          <h3>Connect your wallet to view your portfolio</h3>
          <p>Your on-chain positions will appear here once connected.</p>
        </div>
      )}

      {wallet.connected && invested.length === 0 && (
        <div className="empty-state">
          <h3>No positions yet</h3>
          <p>Visit the Properties page to start investing.</p>
        </div>
      )}

      {wallet.connected && invested.length > 0 && (
        <>
          <div className="stat-grid" style={{ marginBottom: 32 }}>
            <div className="stat-block">
              <div className="stat-label">Total Invested</div>
              <div className="stat-value">${totalInvested.toLocaleString()}</div>
            </div>
            <div className="stat-block">
              <div className="stat-label">Properties</div>
              <div className="stat-value">{invested.length}</div>
            </div>
            <div className="stat-block">
              <div className="stat-label">USDC Balance</div>
              <div className="stat-value">${wallet.balanceUSDC.toLocaleString()}</div>
            </div>
          </div>

          <div className="card card-p" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Positions</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Shares Held</th>
                    <th>APY</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {invested.map(p => (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.name}</td>
                      <td>{p.userShares.toLocaleString()}</td>
                      <td>
                        <span className="tag tag-positive">{p.apy}%</span>
                      </td>
                      <td>${p.userShares.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <InvestmentCalculator properties={properties} />
        </>
      )}

      <div style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Watchlist Comparison</h3>
        <WatchlistComparison properties={properties} watchlistIds={watchlistIds} />
      </div>
    </div>
  );
}

function PlaygroundPage({
  stakers, setStakers, accRewardPerShare, setAccRewardPerShare,
  totalShares, setTotalShares, contractUSDC, setContractUSDC,
  totalDividends, setTotalDividends
}) {
  return (
    <div>
      <div className="section-header">
        <h2>Soroban Playground</h2>
        <p>Simulate the on-chain distribution contract in your browser — no wallet required.</p>
      </div>
      <SorobanPlayground
        stakers={stakers}
        setStakers={setStakers}
        accRewardPerShare={accRewardPerShare}
        setAccRewardPerShare={setAccRewardPerShare}
        totalShares={totalShares}
        setTotalShares={setTotalShares}
        contractUSDC={contractUSDC}
        setContractUSDC={setContractUSDC}
        totalDividends={totalDividends}
        setTotalDividends={setTotalDividends}
      />
      <div style={{ marginTop: 32 }}>
        <StellarWorkflow />
      </div>
    </div>
  );
}

function DocsPage() {
  return (
    <div>
      <div className="section-header">
        <h2>Documentation</h2>
        <p>Everything you need to build on or contribute to StellarFraction.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          {
            icon: <Terminal size={18} />,
            title: 'Contract Development',
            desc: 'Extend the Soroban smart contracts. Add landlord fees, dynamic staking locks, or compound auto-reinvestment.',
            code: 'cargo test',
            link: 'https://github.com/StellarFraction/StellarFraction-contracts',
          },
          {
            icon: <Cpu size={18} />,
            title: 'SDK Integration',
            desc: 'Connect the frontend to Stellar wallets (Freighter, Albedo) and broadcast live Testnet transactions.',
            code: 'npm run dev',
            link: 'https://github.com/StellarFraction/StellarFraction-frontend',
          },
          {
            icon: <GitFork size={18} />,
            title: 'Contribution Flow',
            desc: 'Fork the repo, create a branch, write tests, and open a PR. Read the guide before your first commit.',
            code: 'git checkout -b feat/your-feature',
            link: 'https://github.com/StellarFraction/StellarFraction-contracts/blob/main/CONTRIBUTING.md',
          },
          {
            icon: <BookOpen size={18} />,
            title: 'API Reference',
            desc: 'Full reference for every contract entrypoint, storage key, and event emitted by the distribution contract.',
            code: 'cargo doc --no-deps --open',
            link: 'https://github.com/StellarFraction/StellarFraction-contracts/blob/main/docs/API.md',
          },
        ].map((item, i) => (
          <div key={i} className="card card-p">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: 'var(--text-secondary)' }}>
              {item.icon}
              <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{item.title}</h3>
            </div>
            <p style={{ marginBottom: 14, fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</p>
            <div className="code-block" style={{ marginBottom: 14 }}>{item.code}</div>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}
            >
              View on GitHub <ArrowUpRight size={12} />
            </a>
          </div>
        ))}
      </div>

      <div className="card card-p">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Star size={16} style={{ color: 'var(--warning)' }} />
          <h3 style={{ margin: 0 }}>Before You Contribute</h3>
        </div>
        <p style={{ marginBottom: 16, fontSize: '0.88rem', lineHeight: 1.7 }}>
          Please ⭐ star the repository before opening a pull request — it helps surface the project to more contributors and is a lightweight signal that you've read the codebase. Then fork, make your change on a dedicated branch, ensure <code style={{ background: 'var(--bg-overlay)', padding: '1px 6px', borderRadius: 3 }}>cargo test</code> passes, and open a PR against <code style={{ background: 'var(--bg-overlay)', padding: '1px 6px', borderRadius: 3 }}>main</code>.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="https://github.com/StellarFraction/StellarFraction-contracts" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
            <Github size={14} /> Contracts Repo
          </a>
          <a href="https://github.com/StellarFraction/StellarFraction-frontend" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
            <Github size={14} /> Frontend Repo
          </a>
          <a href="https://github.com/StellarFraction/StellarFraction-backend" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
            <Github size={14} /> Backend Repo
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState('properties');

  const [wallet, setWallet] = useState({ address: '', balanceUSDC: 0, balanceShares: 0, connected: false });
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [watchlistIds, setWatchlistIds] = usePersistentState(WATCHLIST_STORAGE_KEY, DEFAULT_WATCHLIST);

  const [stakers, setStakers] = useState([]);
  const [accRewardPerShare, setAccRewardPerShare] = useState(0);
  const [totalShares, setTotalShares] = useState(4000);
  const [contractUSDC, setContractUSDC] = useState(0);
  const [totalDividends, setTotalDividends] = useState(0);
  const SCALE_FACTOR = 1_000_000_000_000;

  useEffect(() => {
    setStakers([
      { id: 1, name: 'Alice (Investor A)', shares: 1000, debt: 0, usdcBalance: 0, deedBalance: 5000 },
      { id: 2, name: 'Bob (Investor B)',   shares: 3000, debt: 0, usdcBalance: 0, deedBalance: 5000 },
      { id: 3, name: 'You (GC3X4O...)',    shares: 0,    debt: 0, usdcBalance: 0, deedBalance: 5000 },
    ]);
  }, []);

  useEffect(() => {
    setWatchlistIds(ids => pruneUnavailableWatchlistIds(ids, properties));
  }, [properties, setWatchlistIds]);

  useEffect(() => {
    if (wallet.connected) {
      const you = stakers.find(s => s.id === 3);
      if (you) setWallet(prev => ({ ...prev, balanceShares: you.shares }));
    }
  }, [stakers, wallet.connected]);

  const connectWallet = () => {
    setTimeout(() => {
      setWallet({ address: 'GC3X4O...5H2W7P', balanceUSDC: 5000, balanceShares: 0, connected: true });
    }, 800);
  };

  const disconnectWallet = () =>
    setWallet({ address: '', balanceUSDC: 0, balanceShares: 0, connected: false });

  const handleToggleWatchlist = id => setWatchlistIds(ids => toggleWatchlistId(ids, id));
  const handleClearWatchlist  = ()  => setWatchlistIds(DEFAULT_WATCHLIST);

  const handleInvest = (propertyId, amount) => {
    if (!wallet.connected) return;
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, userShares: p.userShares + amount } : p));
    setWallet(prev => ({ ...prev, balanceUSDC: Math.max(0, prev.balanceUSDC - amount) }));
    setStakers(prev => prev.map(s => {
      if (s.id !== 3) return s;
      const pending = calculatePendingReward(s.shares, accRewardPerShare, s.debt, SCALE_FACTOR);
      const newShares = s.shares + amount;
      return { ...s, shares: newShares, debt: (newShares * accRewardPerShare) / SCALE_FACTOR, usdcBalance: s.usdcBalance + pending, deedBalance: Math.max(0, s.deedBalance - amount) };
    }));
    setTotalShares(prev => prev + amount);
  };

  const handleWithdrawShares = (propertyId, amount) => {
    if (!wallet.connected) return;
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, userShares: Math.max(0, p.userShares - amount) } : p));
    setWallet(prev => ({ ...prev, balanceUSDC: prev.balanceUSDC + amount }));
    setStakers(prev => prev.map(s => {
      if (s.id !== 3) return s;
      const pending = calculatePendingReward(s.shares, accRewardPerShare, s.debt, SCALE_FACTOR);
      const newShares = Math.max(0, s.shares - amount);
      return { ...s, shares: newShares, debt: newShares > 0 ? (newShares * accRewardPerShare) / SCALE_FACTOR : 0, usdcBalance: s.usdcBalance + pending, deedBalance: s.deedBalance + amount };
    }));
    setTotalShares(prev => Math.max(0, prev - amount));
  };

  const playgroundProps = {
    stakers, setStakers, accRewardPerShare, setAccRewardPerShare,
    totalShares, setTotalShares, contractUSDC, setContractUSDC,
    totalDividends, setTotalDividends,
  };

  return (
    <div className="app-shell">
      <Navbar
        currentPage={page}
        setPage={setPage}
        wallet={wallet}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />

      <main className="page-content">
        {page === 'properties' && (
          <PropertiesPage
            properties={properties}
            wallet={wallet}
            watchlistIds={watchlistIds}
            onToggleWatchlist={handleToggleWatchlist}
            onClearWatchlist={handleClearWatchlist}
            onInvest={handleInvest}
            onWithdrawShares={handleWithdrawShares}
            totalDividends={totalDividends}
            totalShares={totalShares}
          />
        )}
        {page === 'portfolio'   && <PortfolioPage  properties={properties} watchlistIds={watchlistIds} wallet={wallet} />}
        {page === 'playground'  && <PlaygroundPage {...playgroundProps} />}
        {page === 'docs'        && <DocsPage />}
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        © 2026 StellarFraction · MIT License ·{' '}
        <a href="https://github.com/StellarFraction" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>GitHub</a>
      </footer>
    </div>
  );
}
