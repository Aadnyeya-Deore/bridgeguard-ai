import React from 'react';
import { Shield, Lock, Activity, Radio, AlertTriangle } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

interface NavbarProps {
  activeTab: 'evaluator' | 'registry' | 'whale-radar' | 'alerts';
  setActiveTab: (tab: 'evaluator' | 'registry' | 'whale-radar' | 'alerts') => void;
  walletState: {
    isConnected: boolean;
    isConnecting: boolean;
    address: string | null;
    network: string | null;
    error: string | null;
    walletName: string | null;
  };
  onConnect: () => void;
  onDisconnect: () => void;
  onClearError: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  walletState,
  onConnect,
  onDisconnect,
  onClearError
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-midnight-700/50 bg-midnight-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('evaluator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">BridgeGuard</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
                  AI + ZK
                </span>
              </div>
              <p className="text-xs text-slate-400">Midnight Network Cross-Chain Security</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-midnight-900/60 p-1.5 rounded-xl border border-midnight-800">
            <button
              onClick={() => setActiveTab('evaluator')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'evaluator'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-800/50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>ZK Risk Evaluator</span>
            </button>

            <button
              onClick={() => setActiveTab('registry')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'registry'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Bridge Registry</span>
            </button>

            <button
              onClick={() => setActiveTab('whale-radar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'whale-radar'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-800/50'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Whale Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'alerts'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-800/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Security Alerts</span>
            </button>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-3">
            <WalletConnect
              walletState={walletState}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
              onClearError={onClearError}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
