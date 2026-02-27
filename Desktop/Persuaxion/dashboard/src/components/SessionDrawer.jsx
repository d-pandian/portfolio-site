import { useState, useEffect } from 'react';
import { fetchSession } from '../api.js';

// ── Helpers ──────────────────────────────────────────────────

const CONFIDENCE_COLOR = {
  very_strong: 'text-emerald-400',
  strong:      'text-blue-400',
  medium:      'text-amber-400',
};

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString(undefined, {
    month:  'short',
    day:    'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

// ── Sub-sections ─────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
      {children}
    </h3>
  );
}

function KVGrid({ rows }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
      {rows.map(([label, value]) => (
        <div key={label}>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm text-gray-300 font-mono mt-0.5 truncate" title={String(value)}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function IntentSection({ state }) {
  if (!state) return null;
  const colorCls = CONFIDENCE_COLOR[state.confidence] || 'text-gray-300';

  return (
    <section>
      <SectionHeader>Intent State</SectionHeader>
      <div className="bg-gray-800/50 rounded-xl p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Confidence</p>
          <p className={`text-xl font-bold capitalize mt-1 ${colorCls}`}>
            {state.confidence.replace('_', ' ')}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Score</p>
          <p className="text-xl font-bold text-white mt-1 tabular-nums">{state.score}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Explicit Intent</p>
          <p className={`text-sm font-medium mt-1 ${state.explicit_detected ? 'text-purple-400' : 'text-gray-600'}`}>
            {state.explicit_detected ? '⚡ Detected' : 'Not detected'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">First Detected</p>
          <p className="text-sm text-gray-400 mt-1">{fmt(state.first_detected_at)}</p>
        </div>
      </div>
    </section>
  );
}

function SignalBreakdown({ rows }) {
  if (!rows.length) return null;
  return (
    <section>
      <SectionHeader>Signal Breakdown</SectionHeader>
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800/40 border-b border-gray-800 text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2.5 text-left font-medium">Signal</th>
              <th className="px-4 py-2.5 text-right font-medium">Count</th>
              <th className="px-4 py-2.5 text-right font-medium">Score</th>
              <th className="px-4 py-2.5 text-center font-medium">Explicit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((sig) => (
              <tr
                key={sig.signal_type}
                className="border-b border-gray-800/50 last:border-0"
              >
                <td className="px-4 py-2.5 font-mono text-gray-300 capitalize">
                  {sig.signal_type.toLowerCase().replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-400 tabular-nums">
                  {sig.event_count}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-200 font-semibold tabular-nums">
                  +{sig.total_score_contribution}
                </td>
                <td className="px-4 py-2.5 text-center">
                  {sig.any_explicit ? <span className="text-purple-400">⚡</span> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TransitionHistory({ rows }) {
  if (!rows.length) return null;
  return (
    <section>
      <SectionHeader>Transition History</SectionHeader>
      <div className="space-y-2">
        {rows.map((t, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-600 whitespace-nowrap">{fmt(t.transitioned_at)}</span>
            <span className="text-gray-500 capitalize">
              {(t.from_confidence || 'none').replace('_', ' ')}
            </span>
            <span className="text-gray-700">→</span>
            <span className={`capitalize font-semibold ${CONFIDENCE_COLOR[t.to_confidence] || 'text-gray-300'}`}>
              {t.to_confidence.replace('_', ' ')}
            </span>
            <span className="text-gray-700">via</span>
            <span className="font-mono text-gray-500 capitalize">
              {t.triggering_signal?.toLowerCase().replace(/_/g, ' ')}
            </span>
            <span className="ml-auto text-gray-600 tabular-nums">score {t.score_at_transition}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentEvents({ rows }) {
  if (!rows.length) return null;
  return (
    <section>
      <SectionHeader>Recent Events</SectionHeader>
      <div className="space-y-0">
        {rows.map((ev, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-0 text-xs"
          >
            <span className="text-gray-600 whitespace-nowrap shrink-0">{fmt(ev.timestamp)}</span>
            <span className="font-mono text-gray-400 shrink-0 capitalize">
              {ev.event_type.replace(/_/g, ' ')}
            </span>
            {ev.element_text && (
              <span className="text-gray-600 truncate" title={ev.element_text}>
                &ldquo;{ev.element_text.slice(0, 60)}{ev.element_text.length > 60 ? '…' : ''}&rdquo;
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Main Component ────────────────────────────────────────────

export default function SessionDrawer({ sessionId, onClose }) {
  const [data,    setData]    = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    fetchSession(sessionId)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-gray-900 border-l border-gray-800 z-50 flex flex-col">

        {/* Sticky header */}
        <div className="shrink-0 border-b border-gray-800 px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Session Detail</p>
            <p className="text-xs font-mono text-gray-400 mt-1 break-all">{sessionId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-200 transition-colors mt-0.5 text-lg leading-none ml-4 shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-3 animate-pulse">
              {[80, 60, 70, 50, 65].map((w, i) => (
                <div key={i} className="h-3 bg-gray-800 rounded" style={{ width: `${w}%` }} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">Error loading session: {error}</p>
          )}

          {/* Content */}
          {data && (
            <>
              <IntentSection state={data.intent_state} />

              <section>
                <SectionHeader>Session Info</SectionHeader>
                <KVGrid rows={[
                  ['Product ID',    data.session.product_id   || '—'],
                  ['Variant ID',    data.session.variant_id   || '—'],
                  ['Page Type',     data.session.page_type],
                  ['User Type',     data.session.is_new_user ? 'New' : 'Returning'],
                  ['Started',       fmt(data.session.started_at)],
                  ['Last Active',   fmt(data.session.last_active_at)],
                ]} />
              </section>

              <SignalBreakdown  rows={data.signal_breakdown}  />
              <TransitionHistory rows={data.transition_history} />
              <RecentEvents    rows={data.recent_events}     />
            </>
          )}
        </div>
      </div>
    </>
  );
}
