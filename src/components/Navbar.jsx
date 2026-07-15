import React, { useState } from 'react';
import { Github, Menu, X, Wallet } from 'lucide-react';

const PAGES = [
  { id: 'properties', label: 'Properties' },
  { id: 'portfolio',  label: 'Portfolio' },
  { id: 'playground', label: 'Playground' },
  { id: 'docs',       label: 'Docs' },
];

export default function Navbar({ currentPage, setPage, wallet, onConnect, onDisconnect }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Brand */}
        <div className="navbar-brand" onClick={() => setPage('properties')}>
          <img
            src="/sf-logo.png"
            alt="StellarFraction"
            style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }}
          />
          <span className="brand-name">
            Stellar<span>Fraction</span>
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="navbar-links">
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`nav-link${currentPage === p.id ? ' active' : ''}`}
              onClick={() => setPage(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <a
            href="https://github.com/StellarFraction"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ padding: '7px 10px' }}
            title="GitHub"
          >
            <Github size={16} />
          </a>

          {wallet.connected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                {wallet.address}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={onDisconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onConnect}>
              <Wallet size={14} />
              Connect
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="btn btn-ghost"
            style={{ display: 'none' }}
            id="mobile-menu-btn"
            onClick={() => setMobileOpen(o => !o)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: 56, left: 0, right: 0,
          background: 'var(--bg-raised)', borderBottom: '1px solid var(--border)',
          padding: '8px 16px 16px', zIndex: 99
        }}>
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`nav-link${currentPage === p.id ? ' active' : ''}`}
              style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 4 }}
              onClick={() => { setPage(p.id); setMobileOpen(false); }}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
