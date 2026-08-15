export type RiskVerdict = 'SAFE' | 'CAUTION' | 'HIGH_RISK';

export interface BridgeInfo {
  id: number;
  name: string;
  slug: string;
  icon: string;
  tvl: number; // in USD
  baseRiskScore: number; // 0 - 10000 bps
  auditTier: number; // 0=None, 1=Single Audit, 2=Multi-Audited
  auditors: string[];
  incidentCount: number;
  lastIncidentDate?: string;
  supportedChains: string[];
  status: 'Active' | 'Warning' | 'Paused';
  dailyVolume: number;
  speedMinutes: number;
  nativeAsset: string;
}

export interface RiskEvaluationResult {
  bridgeId: number;
  bridgeName: string;
  verdict: RiskVerdict;
  verdictCode: number; // 0=SAFE, 1=CAUTION, 2=HIGH_RISK
  confidenceScore: number; // 0 - 100%
  liquidityStressPct: number;
  incidentRiskMultiplier: number;
  auditGrade: string;
  zkProofHash: string;
  evaluationNonce: number;
  timestamp: number;
  aiTransferRecommendation: string;
  mevProtectionScore: number;
  maxRecommendedChunkSize: number;
}

export interface SecurityAlert {
  id: string;
  bridgeId: number;
  bridgeName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: number;
  mitigation: string;
  isResolved: boolean;
}

export interface WhaleActivityEvent {
  id: string;
  bridgeName: string;
  destinationChain: string;
  proofNonce: string;
  anonymizedTier: 'Tier 1 ($100k+)' | 'Tier 2 ($500k+)' | 'Tier 3 ($2M+)' | 'Mega Whale ($10M+)';
  verdict: RiskVerdict;
  timestamp: number;
  zkCommitment: string;
}

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  network: string | null;
  error: string | null;
  walletName: string | null;
}

export interface ZKProofProgress {
  step: 'idle' | 'generating_witness' | 'building_zk_circuit' | 'verifying_onchain' | 'complete' | 'error';
  message: string;
  percent: number;
}
