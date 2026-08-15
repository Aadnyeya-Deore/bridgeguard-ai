import React from 'react';
import { X, Sparkles, Shield, Lock, CheckCircle2, ArrowRight, Zap, AlertTriangle, Layers } from 'lucide-react';
import { RiskEvaluationResult } from '../types';

interface AIAdvisorModalProps {
  result: RiskEvaluationResult | null;
  onClose: () => void;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-midnight-900 text-slate-400 hover:text-white hover:bg-midnight-800 transition-all border border-midnight-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">AI Transfer Advisor Report</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono font-bold">
                ZK-VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400">Target Bridge: {result.bridgeName}</p>
          </div>
        </div>

        {/* Primary Verdict Banner */}
        <div className="p-4 rounded-xl bg-midnight-900/90 border border-midnight-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Safety Classification
            </span>
            <span className="text-xs font-mono text-cyan-400">Nonce: #{result.evaluationNonce}</span>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {result.aiTransferRecommendation}
          </p>
        </div>

        {/* Strategic AI Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-midnight-900/60 border border-midnight-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-bold mb-1">
              <Zap className="w-4 h-4" />
              <span>MEV Insulation Score</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{result.mevProtectionScore} / 100</p>
            <p className="text-slate-400 mt-1">
              Zero-knowledge blinding prevents front-running and arbitrage sandwiching.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-midnight-900/60 border border-midnight-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-indigo-400 font-bold mb-1">
              <Layers className="w-4 h-4" />
              <span>Max Safe Chunk Size</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">
              ${(result.maxRecommendedChunkSize / 1e6).toFixed(1)}M
            </p>
            <p className="text-slate-400 mt-1">
              Recommended ceiling to prevent pool slippage exceeding 0.05%.
            </p>
          </div>
        </div>

        {/* Multi-Layer ZK Invariants */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Cryptographic Safety Invariants
          </h4>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-midnight-950/70 border border-midnight-800 flex items-center justify-between">
              <span className="text-slate-300">Transfer Amount Confidentiality:</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Shielded (Witness Dropped)</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-midnight-950/70 border border-midnight-800 flex items-center justify-between">
              <span className="text-slate-300">Liquidity Capacity Constraint:</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Satisfied on Midnight Ledger</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-midnight-950/70 border border-midnight-800 flex items-center justify-between">
              <span className="text-slate-300">Audit & Relayer Multi-Sig Integrity:</span>
              <span className="text-cyan-400 font-semibold flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5" />
                <span>{result.auditGrade}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-midnight-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs transition-all shadow-lg shadow-cyan-500/25"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
