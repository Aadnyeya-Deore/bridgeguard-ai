import React, { useState } from 'react';
import { Shield, Lock, EyeOff, Sparkles, CheckCircle2, AlertTriangle, AlertOctagon, RefreshCw, Cpu, ExternalLink } from 'lucide-react';
import { BridgeInfo, RiskEvaluationResult, ZKProofProgress } from '../types';
import { contractAdapter, REGISTERED_BRIDGES } from '../services/contractAdapter';

interface RiskEvaluatorProps {
  bridges: BridgeInfo[];
  onOpenAdvisor: (result: RiskEvaluationResult) => void;
}

export const RiskEvaluator: React.FC<RiskEvaluatorProps> = ({ bridges, onOpenAdvisor }) => {
  const bridgeList = bridges && bridges.length > 0 ? bridges : REGISTERED_BRIDGES;
  const [selectedBridgeId, setSelectedBridgeId] = useState<number>(bridgeList[0]?.id || 1);
  const [transferAmountInput, setTransferAmountInput] = useState<string>('50000');
  const [riskToleranceBps, setRiskToleranceBps] = useState<number>(2000); // 20.00%
  const [destinationChain, setDestinationChain] = useState<string>('Ethereum');
  
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [zkProgress, setZkProgress] = useState<ZKProofProgress>({
    step: 'idle',
    message: '',
    percent: 0,
  });
  const [evaluationResult, setEvaluationResult] = useState<RiskEvaluationResult | null>(null);

  const selectedBridge = bridgeList.find((b) => b.id === selectedBridgeId) || bridgeList[0] || REGISTERED_BRIDGES[0];

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(transferAmountInput) || 1000;
    if (amountNum <= 0) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      // Execute Zero-Knowledge Proof constraint evaluation
      const result = await contractAdapter.evaluateTransferRiskZK(
        selectedBridge.id,
        amountNum,
        riskToleranceBps,
        (progress) => setZkProgress(progress)
      );

      setEvaluationResult(result);
    } catch (err) {
      console.error("ZK Risk Evaluation error:", err);
      setZkProgress({
        step: 'error',
        message: 'ZK Proof constraint verification failed.',
        percent: 0,
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'SAFE':
        return (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-base tracking-wide">VERDICT: SAFE ROUTE</span>
          </div>
        );
      case 'CAUTION':
        return (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold shadow-lg shadow-amber-500/10">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-base tracking-wide">VERDICT: CAUTION ADVISED</span>
          </div>
        );
      case 'HIGH_RISK':
      default:
        return (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-semibold shadow-lg shadow-rose-500/10">
            <AlertOctagon className="w-5 h-5" />
            <span className="text-base tracking-wide">VERDICT: HIGH RISK</span>
          </div>
        );
    }
  };

  if (!selectedBridge) {
    return (
      <div className="text-center py-16 text-slate-400">
        Loading bridge configurations...
      </div>
    );
  }

  const supportedChains = selectedBridge.supportedChains || ["Midnight", "Ethereum"];
  const auditors = selectedBridge.auditors || ["CertiK"];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase shimmer-badge">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero-Knowledge Cross-Chain Protection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          BridgeGuard <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">AI Advisor</span>
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
          Evaluate cross-chain bridge safety, liquidity depth, and audit integrity in <strong className="text-cyan-400">Zero-Knowledge</strong>.
          Your private transfer amount is proven mathematically and never broadcast to public mempools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-midnight-700/60 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-midnight-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-lg font-bold text-white">Configure Bridge Assessment</h2>
              </div>

              {/* Privacy Badge */}
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                <EyeOff className="w-3.5 h-3.5 text-indigo-400" />
                <span>Zero-Knowledge Protected</span>
              </div>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-5">
              {/* Select Bridge */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Target Cross-Chain Bridge
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {bridgeList.map((bridge) => {
                    const isSelected = bridge.id === selectedBridge.id;
                    return (
                      <button
                        type="button"
                        key={bridge.id}
                        onClick={() => setSelectedBridgeId(bridge.id)}
                        className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                            : 'bg-midnight-900/60 border-midnight-800 text-slate-400 hover:text-slate-200 hover:border-midnight-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xl">{bridge.icon}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-midnight-800 text-slate-300 font-mono">
                            ${(bridge.tvl / 1e6).toFixed(0)}M
                          </span>
                        </div>
                        <span className="mt-2 text-xs font-bold line-clamp-1">{bridge.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Destination Chain & Transfer Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Destination Network
                  </label>
                  <select
                    value={destinationChain}
                    onChange={(e) => setDestinationChain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900/80 border border-midnight-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    {supportedChains.map((chain) => (
                      <option key={chain} value={chain} className="bg-midnight-900 text-white">
                        {chain}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Private Transfer Size ($)
                    </label>
                    <span className="text-[11px] text-cyan-400 flex items-center space-x-1 font-mono">
                      <Lock className="w-3 h-3" />
                      <span>Witness only</span>
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 font-mono">$</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={transferAmountInput}
                      onChange={(e) => setTransferAmountInput(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-midnight-900/80 border border-midnight-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Risk Tolerance Slider */}
              <div className="bg-midnight-900/60 p-4 rounded-xl border border-midnight-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider">
                    Max Acceptable Risk Tolerance:
                  </span>
                  <span className="text-cyan-400 font-mono font-bold text-sm">
                    {(riskToleranceBps / 100).toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={riskToleranceBps}
                  onChange={(e) => setRiskToleranceBps(parseInt(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-midnight-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5.0% (Strict / Institutional)</span>
                  <span>25.0% (Moderate)</span>
                  <span>50.0% (High Appetite)</span>
                </div>
              </div>

              {/* Mandatory Visible Privacy Label */}
              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-medium text-cyan-200">Proved without revealing your input</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  Compact ZK-SNARK
                </span>
              </div>

              {/* Submit / Prove Button */}
              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:to-indigo-600 text-white font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Executing Zero-Knowledge Assessment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-cyan-200" />
                    <span>Evaluate Bridge Route with AI + ZK</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Dynamic Proof Progress & Evaluation Result */}
        <div className="lg:col-span-5 space-y-6">
          {/* ZK Proving State Card */}
          {isEvaluating && (
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Midnight Proof Server Proving</h3>
                  <p className="text-xs text-slate-400">Compact ZK-Circuit Execution</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{zkProgress.message}</span>
                  <span className="text-cyan-400 font-bold">{zkProgress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-midnight-900 rounded-full overflow-hidden border border-midnight-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                    style={{ width: `${zkProgress.percent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Evaluation Result View */}
          {evaluationResult ? (
            <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-midnight-700/80 shadow-2xl space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">On-Chain Risk Result</span>
                  <h3 className="text-lg font-bold text-white">{evaluationResult.bridgeName}</h3>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded bg-midnight-850 text-cyan-400 border border-midnight-700">
                  Nonce #{evaluationResult.evaluationNonce}
                </span>
              </div>

              {/* Verdict Header */}
              <div className="flex justify-center py-1">
                {getVerdictBadge(evaluationResult.verdict)}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-midnight-900/60 border border-midnight-800">
                  <span className="text-slate-400">Confidence Score:</span>
                  <p className="text-base font-bold text-white font-mono mt-0.5">
                    {evaluationResult.confidenceScore}%
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-midnight-900/60 border border-midnight-800">
                  <span className="text-slate-400">Audit Grade:</span>
                  <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                    {evaluationResult.auditGrade}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-midnight-900/60 border border-midnight-800">
                  <span className="text-slate-400">MEV Insulation:</span>
                  <p className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                    {evaluationResult.mevProtectionScore} / 100
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-midnight-900/60 border border-midnight-800">
                  <span className="text-slate-400">Liquidity Stress:</span>
                  <p className="text-base font-bold text-slate-200 font-mono mt-0.5">
                    {evaluationResult.liquidityStressPct.toFixed(3)}%
                  </p>
                </div>
              </div>

              {/* AI Transfer Recommendation Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-midnight-900 to-indigo-950/40 border border-midnight-700/80 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Route Recommendation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {evaluationResult.aiTransferRecommendation}
                </p>
              </div>

              {/* ZK Proof Hash Info */}
              <div className="text-[11px] text-slate-400 bg-midnight-950/70 p-2.5 rounded-lg border border-midnight-800 font-mono break-all flex items-center justify-between">
                <div>
                  <span className="text-slate-500">ZK Proof: </span>
                  <span className="text-cyan-400">{evaluationResult.zkProofHash.slice(0, 24)}...</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-sans font-semibold">Verified</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-1">
                <button
                  onClick={() => onOpenAdvisor(evaluationResult)}
                  className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
                >
                  <span>Open Full AI Advisor Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Idle Preview Card */
            <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-midnight-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-midnight-900 border border-midnight-700 flex items-center justify-center mx-auto text-cyan-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Select a Bridge & Run Assessment</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Click 'Evaluate Bridge Route' to generate a Zero-Knowledge proof and inspect real-time AI security advice.
                </p>
              </div>

              <div className="text-left bg-midnight-900/60 p-4 rounded-xl border border-midnight-800 space-y-2 text-xs text-slate-400">
                <div className="font-semibold text-slate-300">Active Bridge Selected:</div>
                <div className="flex items-center justify-between text-white font-medium">
                  <span>{selectedBridge.name}</span>
                  <span className="font-mono text-cyan-400">${(selectedBridge.tvl / 1e6).toFixed(1)}M TVL</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Auditors: {auditors.join(', ')}</span>
                  <span>Est. Time: {selectedBridge.speedMinutes}m</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
