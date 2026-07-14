import { GitCompareArrows, MapPin } from 'lucide-react';
import { formatUSD } from '../utils/format';
import { buildWatchlistComparison } from '../utils/properties';

export default function WatchlistComparison({
  properties,
  watchlistIds,
  investmentAmount = 1000,
}) {
  const comparison = buildWatchlistComparison(properties, watchlistIds, investmentAmount);

  if (comparison.length < 2) return null;

  return (
    <section className="glass-card" style={{ marginBottom: '48px' }} aria-labelledby="watchlist-comparison-title">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <GitCompareArrows size={22} color="var(--primary-cyan)" aria-hidden="true" />
        <h2 id="watchlist-comparison-title" style={{ fontSize: '1.5rem' }}>
          Saved Property Comparison
        </h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Compare projected income from a {formatUSD(investmentAmount)} investment in each saved asset.
      </p>

      <div className="watchlist-comparison-grid">
        {comparison.map(property => (
          <article key={property.id} className="watchlist-comparison-card">
            <div>
              <span className="badge-stellar">{property.tokenCode}</span>
              <h3>{property.name}</h3>
              <p><MapPin size={13} aria-hidden="true" /> {property.location}</p>
            </div>
            <dl>
              <div><dt>APY</dt><dd>{property.apy}%</dd></div>
              <div><dt>Property value</dt><dd>{formatUSD(property.value)}</dd></div>
              <div><dt>Monthly income</dt><dd>{formatUSD(property.monthlyIncome)}</dd></div>
              <div><dt>Annual income</dt><dd>{formatUSD(property.annualIncome)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
