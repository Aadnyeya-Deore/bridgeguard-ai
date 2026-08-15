import React from 'react';
import { Shield, Lock, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-midnight-800/80 bg-midnight-950/90 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">BridgeGuard AI</span>
            <p className="text-xs text-slate-400">
              Built for <strong className="text-cyan-300">INTO the Midnight — SPPU</strong> (Rise In Bootcamp)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <div className="flex items-center space-x-1 text-cyan-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Powered by Midnight Compact & ZK-SNARKs</span>
          </div>
          <a
            href="https://faucet.preview.midnight.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 transition-colors flex items-center space-x-1"
          >
            <span>Preview Faucet</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://docs.midnight.network"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-200 transition-colors flex items-center space-x-1"
          >
            <span>Midnight Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
