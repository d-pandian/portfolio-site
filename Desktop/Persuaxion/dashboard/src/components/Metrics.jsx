import { useState, useEffect } from 'react';
import { fetchMetrics } from '../api.js';

const CARDS = [
  {
    key:   'total_pdp_sessions',
    label: 'PDP Sessions',
    desc:  'Total product page sessions',
  },
  {
    key:   'medium_fit_sessions',
    label: 'Medium Intent',
    desc:  'Confidence: medium',
    color: 'text-amber-400',
  },
  {
    key:   'strong_plus_fit_sessions',
    label: 'Strong+ Intent',
    desc:  'Strong or very strong',
    color: 'text-emerald-400',
  },
  {
    key:   'new_user_sessions',
    label: 'New Users',
    desc:  'First-time visitors',
  },
  {
    key:   'returning_user_sessions',
    label: 'Returning Users',
    desc:  'Returning visitors',
  },
];

function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="h-2.5 bg-gray-800 rounded w-1/2 mb-4" />
      <div className="h-8 bg-gray-800 rounded w-1/3 mb-3" />
      <div className="h-2 bg-gray-800 rounded w-2/3" />
    </div>
  );
}

export default function Metrics({ shopDomain }) {
  const [data,    setData]    = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMetrics(shopDomain)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [shopDomain]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {CARDS.map((c) => <SkeletonCard key={c.key} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-900/50 rounded-xl px-5 py-4 text-sm text-red-400">
        Failed to load metrics: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {CARDS.map((c) => (
        <div
          key={c.key}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            {c.label}
          </p>
          <p className={`text-3xl font-bold tabular-nums mt-2 ${c.color || 'text-white'}`}>
            {data[c.key].toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1.5">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
