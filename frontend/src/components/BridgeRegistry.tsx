import React, { useState } from 'react';
import { Search, ShieldCheck, ExternalLink, Activity, CheckCircle, Clock } from 'lucide-react';
import { BridgeInfo } from '../types';
import { calculateCompositeSecurityScore } from '../services/aiRiskEngine';
import { REGISTERED_BRIDGES } from '../services/contractAdapter';

interface BridgeRegistryProps {
  bridges: BridgeInfo[];
  onSelectBridgeForEvaluation: (bridgeId: number) => void;
}

export const BridgeRegistry: React.FC<BridgeRegistryProps> = ({
  bridges,
  onSelectBridgeForEvaluation,
}) => {
  const bridgeList = bridges && bridges.length > 0 ? bridges : REGISTERED_BRIDGES;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChainFilter, setSelectedChainFilter] = useState('All');

  const allChains = ['All', 'Midnight', 'Ethereum', 'Cardano', 'Solana', 'Arbitrum', 'Cosmos', 'Polygon'];

  const filteredBridges = bridgeList.filter((bridge) => {
    const auditorsList = bridge.auditors || [];
    const matchesSearch =
      bridge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bridge.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auditorsList.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

    const supportedList = bridge.supportedChains || [];
    const matchesChain =
      selectedChainFilter === 'All' || supportedList.includes(selectedChainFilter);

    return matchesSearch && matchesChain;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 75) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            On-Chain Bridge Registry & Liquidity Monitor
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time security tiers, liquidity depths, and audit statuses verified on Midnight ledger.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300 bg-midnight-900/80 px-3.5 py-2 rounded-xl border border-midnight-700">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>
            Total Monitored TVL:{' '}
            <strong className="text-white font-mono">
              ${(bridgeList.reduce((acc, b) => acc + b.tvl, 0) / 1e6).toFixed(1)}M
            </strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search bridges, auditors (Zellic, OpenZeppelin), or protocols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-900/80 border border-midnight-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Chain Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {allChains.map((chain) => (
            <button
              key={chain}
              onClick={() => setSelectedChainFilter(chain)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedChainFilter === chain
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-midnight-900/70 border border-midnight-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {chain}
            </button>
          ))}
        </div>
      </div>

      {/* Bridge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBridges.map((bridge) => {
          const score = calculateCompositeSecurityScore(bridge);
          const auditors = bridge.auditors || [];
          const supported = bridge.supportedChains || [];
          return (
            <div
              key={bridge.id}
              className="glass-panel-interactive rounded-2xl p-6 border border-midnight-700/70 shadow-lg flex flex-col justify-between space-y-5"
            >
              {/* Header Info */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-midnight-850 border border-midnight-700 flex items-center justify-center text-2xl shadow-inner">
                      {bridge.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{bridge.name}</h3>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{bridge.status}</span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>~{bridge.speedMinutes}m</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Score Badge */}
                  <div className={`px-2.5 py-1 rounded-xl border font-mono font-bold text-xs ${getScoreColor(score)}`}>
                    {score}/100
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-5 text-xs">
                  <div className="bg-midnight-950/60 p-2.5 rounded-lg border border-midnight-800/80">
                    <span className="text-slate-400">Total Value Locked</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">
                      ${(bridge.tvl / 1e6).toFixed(1)}M
                    </p>
                  </div>

                  <div className="bg-midnight-950/60 p-2.5 rounded-lg border border-midnight-800/80">
                    <span className="text-slate-400">24h Volume</span>
                    <p className="text-sm font-bold text-slate-200 font-mono mt-0.5">
                      ${(bridge.dailyVolume / 1e6).toFixed(1)}M
                    </p>
                  </div>
                </div>

                {/* Audit & Security Status */}
                <div className="mt-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Audit Status:</span>
                    </span>
                    <span className="text-slate-200 font-semibold">
                      {bridge.auditTier === 2 ? 'Multi-Audited (Tier 2)' : (bridge.auditTier === 1 ? 'Single Audited' : 'Unaudited')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Auditors:</span>
                    <span className="text-slate-300 line-clamp-1">{auditors.join(', ')}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Incidents:</span>
                    <span className={bridge.incidentCount > 0 ? 'text-amber-400 font-medium' : 'text-emerald-400'}>
                      {bridge.incidentCount === 0 ? '0 Reported Exploits' : `${bridge.incidentCount} Historical`}
                    </span>
                  </div>
                </div>

                {/* Chains */}
                <div className="mt-4 pt-3 border-t border-midnight-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Supported Networks:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {supported.map((chain) => (
                      <span
                        key={chain}
                        className="text-[10px] px-2 py-0.5 rounded bg-midnight-900 text-slate-300 border border-midnight-800"
                      >
                        {chain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectBridgeForEvaluation(bridge.id)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
              >
                <span>Evaluate Route with ZK</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
