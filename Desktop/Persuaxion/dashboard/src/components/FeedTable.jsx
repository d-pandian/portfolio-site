import { useState, useEffect, useCallback } from 'react';
import { fetchFeed } from '../api.js';

// ── Helpers ──────────────────────────────────────────────────

const CONFIDENCE_BADGE = {
  very_strong: 'bg-emerald-900/50 text-emerald-400 ring-1 ring-emerald-800',
  strong:      'bg-blue-900/50   text-blue-400   ring-1 ring-blue-800',
  medium:      'bg-amber-900/50  text-amber-400  ring-1 ring-amber-800',
};

function ConfidenceBadge({ level }) {
  const cls = CONFIDENCE_BADGE[level] || 'bg-gray-800 text-gray-400 ring-1 ring-gray-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {level.replace('_', ' ')}
    </span>
  );
}

function relativeTime(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Component ─────────────────────────────────────────────────

export default function FeedTable({ shopDomain, onSelectSession }) {
  const [data,       setData]       = useState(null);
  const [error,      setError]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [confidence, setConfidence] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFeed(shopDomain, page, 20, confidence || null)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [shopDomain, page, confidence]);

  useEffect(() => { load(); }, [load]);

  const pagination = data?.pagination;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-200">Live Intent Feed</h2>
          {pagination && (
            <span className="text-xs text-gray-600 tabular-nums">
              ({pagination.total.toLocaleString()})
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={confidence}
            onChange={(e) => { setConfidence(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-600"
          >
            <option value="">All confidence</option>
            <option value="medium">Medium</option>
            <option value="strong">Strong</option>
            <option value="very_strong">Very Strong</option>
          </select>

          <button
            onClick={load}
            disabled={loading}
            className="text-xs text-gray-400 hover:text-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ── Error ────────────────────────────────────────────── */}
      {error && (
        <p className="text-red-400 text-sm px-5 py-8">
          Failed to load feed: {error}
        </p>
      )}

      {/* ── Table ────────────────────────────────────────────── */}
      {!error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30">
                {['Session', 'Product', 'Confidence', 'Score', 'Top Signals', 'User', 'Updated'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className={loading ? 'opacity-40 pointer-events-none' : ''}>
              {data?.sessions.map((row) => (
                <tr
                  key={row.session_id}
                  onClick={() => onSelectSession(row.session_id)}
                  className="border-b border-gray-800/60 hover:bg-gray-800/50 cursor-pointer transition-colors last:border-0"
                >
                  {/* Session ID */}
                  <td className="px-5 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {row.session_id.slice(0, 8)}&hellip;
                  </td>

                  {/* Product ID */}
                  <td className="px-5 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">
                    {row.product_id || <span className="text-gray-700">—</span>}
                  </td>

                  {/* Confidence + explicit flag */}
                  <td className="px-5 py-3 whitespace-nowrap">
                    <ConfidenceBadge level={row.confidence} />
                    {row.explicit_detected && (
                      <span className="ml-1.5 text-purple-400 text-xs" title="Explicit intent detected">
                        ⚡
                      </span>
                    )}
                  </td>

                  {/* Score */}
                  <td className="px-5 py-3 text-gray-200 font-semibold tabular-nums">
                    {row.score}
                  </td>

                  {/* Top signals */}
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(row.top_signals || []).slice(0, 3).map((sig) => (
                        <span
                          key={sig}
                          className="inline-block text-xs bg-gray-800 text-gray-400 rounded px-1.5 py-0.5 whitespace-nowrap"
                        >
                          {sig.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* User type */}
                  <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {row.is_new_user ? 'New' : 'Returning'}
                  </td>

                  {/* Updated */}
                  <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {relativeTime(row.last_updated_at)}
                  </td>
                </tr>
              ))}

              {data?.sessions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center text-gray-600 text-sm">
                    No sessions with detected intent yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────── */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 tabular-nums">
            Page {pagination.page} of {pagination.total_pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
              disabled={page === pagination.total_pages || loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
