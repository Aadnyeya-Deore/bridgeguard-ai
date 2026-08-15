import React from 'react';
import { Radio, ShieldAlert, Lock, CheckCircle2, AlertTriangle, ArrowUpRight, Cpu } from 'lucide-react';
import { WhaleActivityEvent } from '../types';
import { INITIAL_WHALE_EVENTS } from '../services/aiRiskEngine';

export const WhaleRadar: React.FC = () => {
  const events: WhaleActivityEvent[] = INITIAL_WHALE_EVENTS;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            <span>Zero-Knowledge Mempool Shield</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Whale Activity & Threat Radar
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time aggregated bridge transfer proofs. High-volume transfers are verified with ZK commitments without exposing wallet addresses or exact transfer balances.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-midnight-900/80 p-3 rounded-xl border border-midnight-700 text-xs">
          <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300">
            MEV Sandwich Attacks Prevented:{' '}
            <strong className="text-emerald-400 font-mono">1,482</strong>
          </span>
        </div>
      </div>

      {/* Radar Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 border border-midnight-700/70 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            24h Shielded Volume
          </span>
          <p className="text-2xl font-bold text-white font-mono">$114.8M</p>
          <span className="text-xs text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Verified in Zero-Knowledge</span>
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-midnight-700/70 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Average Proving Latency
          </span>
          <p className="text-2xl font-bold text-cyan-400 font-mono">1.82s</p>
          <span className="text-xs text-slate-400 flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Midnight Proof Server :6300</span>
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-midnight-700/70 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Bridge Relayers
          </span>
          <p className="text-2xl font-bold text-indigo-300 font-mono">28 / 28</p>
          <span className="text-xs text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Operational & Synced</span>
          </span>
        </div>
      </div>

      {/* Live Stream Table */}
      <div className="glass-panel rounded-2xl border border-midnight-700/70 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-midnight-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="font-bold text-white text-base">Live ZK Proof Stream</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Synced with Preview Indexer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-midnight-900/80 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-midnight-800">
              <tr>
                <th className="px-6 py-3.5">Bridge Route</th>
                <th className="px-6 py-3.5">Destination</th>
                <th className="px-6 py-3.5">Privacy Tier</th>
                <th className="px-6 py-3.5">ZK Proof Commitment</th>
                <th className="px-6 py-3.5">Verdict</th>
                <th className="px-6 py-3.5 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800">
              {events.map((event) => {
                const isSafe = event.verdict === 'SAFE';
                return (
                  <tr key={event.id} className="hover:bg-midnight-850/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white flex items-center space-x-2">
                      <span>{event.bridgeName}</span>
                      <span className="text-slate-500 text-xs font-mono">{event.proofNonce}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-midnight-900 text-cyan-300 text-xs font-mono border border-midnight-700">
                        {event.destinationChain}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {event.anonymizedTier}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-cyan-400" />
                      <span>{event.zkCommitment}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isSafe
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isSafe ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{event.verdict}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-slate-400">
                      {Math.floor((Date.now() - event.timestamp) / 60000)}m ago
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
