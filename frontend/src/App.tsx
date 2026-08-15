import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RiskEvaluator } from './components/RiskEvaluator';
import { BridgeRegistry } from './components/BridgeRegistry';
import { WhaleRadar } from './components/WhaleRadar';
import { SecurityAlerts } from './components/SecurityAlerts';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { Footer } from './components/Footer';
import { useMidnight } from './hooks/useMidnight';
import { contractAdapter, REGISTERED_BRIDGES } from './services/contractAdapter';
import { BridgeInfo, RiskEvaluationResult } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'evaluator' | 'registry' | 'whale-radar' | 'alerts'>('evaluator');
  const [bridges, setBridges] = useState<BridgeInfo[]>(REGISTERED_BRIDGES);
  const [advisorModalResult, setAdvisorModalResult] = useState<RiskEvaluationResult | null>(null);

  const {
    isConnected,
    isConnecting,
    address,
    network,
    error,
    walletName,
    connect,
    disconnect,
    clearError
  } = useMidnight();

  useEffect(() => {
    contractAdapter.getBridges().then((b) => {
      if (b && b.length > 0) setBridges(b);
    });
  }, []);

  const handleSelectBridgeForEvaluation = (bridgeId: number) => {
    setActiveTab('evaluator');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-midnight-950 text-slate-100">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          walletState={{
            isConnected,
            isConnecting,
            address,
            network,
            error,
            walletName
          }}
          onConnect={connect}
          onDisconnect={disconnect}
          onClearError={clearError}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {activeTab === 'evaluator' && (
            <RiskEvaluator
              bridges={bridges}
              onOpenAdvisor={(result) => setAdvisorModalResult(result)}
            />
          )}

          {activeTab === 'registry' && (
            <BridgeRegistry
              bridges={bridges}
              onSelectBridgeForEvaluation={handleSelectBridgeForEvaluation}
            />
          )}

          {activeTab === 'whale-radar' && <WhaleRadar />}

          {activeTab === 'alerts' && <SecurityAlerts />}
        </main>
      </div>

      <Footer />

      {/* AI Advisor Modal */}
      <AIAdvisorModal
        result={advisorModalResult}
        onClose={() => setAdvisorModalResult(null)}
      />
    </div>
  );
}

export default App;
