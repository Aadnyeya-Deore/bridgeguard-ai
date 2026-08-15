import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, Bell, ArrowRight, ShieldCheck } from 'lucide-react';
import { SecurityAlert } from '../types';
import { INITIAL_SECURITY_ALERTS } from '../services/aiRiskEngine';

export const SecurityAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_SECURITY_ALERTS);

  const getSeverityBadge = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold uppercase">Critical Alert</span>;
      case 'high':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase">High Severity</span>;
      case 'medium':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase">Medium Advisory</span>;
      case 'low':
      default:
        return <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase">Protocol Info</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase mb-2">
            <Bell className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span>Real-Time Incident Stream</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Security Incident & Threat Alerts
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Automated exploit alerts, validator telemetry deviations, and smart contract circuit-breaker status.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-midnight-900/80 px-3.5 py-2 rounded-xl border border-midnight-700 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">
            Active Guard Nodes: <strong className="text-white font-mono">64 / 64</strong>
          </span>
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`glass-panel rounded-2xl p-6 border transition-all ${
              alert.severity === 'critical' || alert.severity === 'high'
                ? 'border-rose-500/40 bg-rose-950/10'
                : 'border-midnight-700/70 hover:border-cyan-500/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-midnight-800 pb-3">
              <div className="flex items-center space-x-3">
                {getSeverityBadge(alert.severity)}
                <span className="text-sm font-bold text-white">{alert.bridgeName}</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                {alert.isResolved ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Resolved</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Under Investigation</span>
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-base font-bold text-slate-100">{alert.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{alert.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-midnight-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-400">
                <span className="font-semibold text-cyan-400">AI Mitigation Protocol: </span>
                <span>{alert.mitigation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
