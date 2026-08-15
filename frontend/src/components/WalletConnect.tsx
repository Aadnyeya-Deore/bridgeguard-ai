import React, { useState } from 'react';
import { Wallet, LogOut, CheckCircle2, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { WalletState } from '../types';

interface WalletConnectProps {
  walletState: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  onClearError: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  walletState,
  onConnect,
  onDisconnect,
  onClearError,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <div className="relative">
      {walletState.isConnected ? (
        <div className="flex items-center space-x-2">
          {/* Network Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">Preview Net</span>
          </div>

          {/* Connected Address Button */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-midnight-850 hover:bg-midnight-800 border border-midnight-700 text-slate-200 text-sm font-medium transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-[10px] text-black font-bold">
                M
              </div>
              <span className="font-mono">{formatAddress(walletState.address)}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl glass-panel border border-midnight-700/80 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-xs text-slate-400 mb-1">Connected Wallet</div>
                <div className="text-sm font-semibold text-white mb-2 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{walletState.walletName || 'Lace DApp Connector'}</span>
                </div>

                <div className="text-xs font-mono bg-midnight-950/80 p-2 rounded-lg text-slate-300 break-all border border-midnight-800 mb-3 select-all">
                  {walletState.address}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-midnight-800 pt-2 mb-3">
                  <span>Network:</span>
                  <span className="text-cyan-400 font-semibold uppercase">{walletState.network || 'preview'}</span>
                </div>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onDisconnect();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={onConnect}
          disabled={walletState.isConnecting}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all disabled:opacity-50"
        >
          {walletState.isConnecting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 text-white" />
              <span>Connect Lace Wallet</span>
            </>
          )}
        </button>
      )}

      {/* Error Toast / Alert */}
      {walletState.error && (
        <div className="absolute right-0 top-full mt-2 w-80 p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs shadow-xl z-50 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-300">Connection Error</p>
            <p className="mt-0.5 text-slate-300">{walletState.error}</p>
            <button
              onClick={onClearError}
              className="mt-2 text-rose-400 hover:text-rose-300 underline font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
