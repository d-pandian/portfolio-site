import { useState } from 'react';
import Metrics       from './components/Metrics.jsx';
import FeedTable     from './components/FeedTable.jsx';
import SessionDrawer from './components/SessionDrawer.jsx';

const SHOP_DOMAIN = import.meta.env.VITE_SHOP_DOMAIN || 'dev.myshopify.com';

export default function App() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />
            <span className="text-sm font-semibold tracking-tight">Persuaxion</span>
            <span className="text-gray-700 text-sm">/</span>
            <span className="text-sm text-gray-500 font-mono">{SHOP_DOMAIN}</span>
          </div>
          <span className="text-xs text-gray-600">Intent Intelligence</span>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <Metrics shopDomain={SHOP_DOMAIN} />
        <FeedTable shopDomain={SHOP_DOMAIN} onSelectSession={setSelectedSessionId} />
      </main>

      {/* ── Session Drawer ─────────────────────────────────────── */}
      {selectedSessionId && (
        <SessionDrawer
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}

    </div>
  );
}
