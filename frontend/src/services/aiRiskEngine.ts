import { SecurityAlert, WhaleActivityEvent, BridgeInfo } from '../types';

export const INITIAL_SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: "alert-001",
    bridgeId: 2,
    bridgeName: "Wormhole Core Bridge",
    severity: "medium",
    title: "Validator Relayer Latency Spike Detected",
    description: "Minor cross-chain confirmation delay observed between Solana and Midnight endpoints. Bridge remains secure; funds are not at risk.",
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    mitigation: "Automatic relayer load-balancing active. Expected clearance within 10 minutes.",
    isResolved: false,
  },
  {
    id: "alert-002",
    bridgeId: 5,
    bridgeName: "Celer cBridge",
    severity: "low",
    title: "Liquidity Rebalancing in Progress",
    description: "Pool liquidity rebalancing on BNB Chain gateway. Temporary higher slippage for transfers exceeding $500,000.",
    timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
    mitigation: "Use Stargate or LayerZero for transfers > $500k during rebalance window.",
    isResolved: false,
  },
  {
    id: "alert-003",
    bridgeId: 1,
    bridgeName: "LayerZero Omnichain Gateway",
    severity: "low",
    title: "Security Audit v2.4 Certified",
    description: "Zellic security team concluded quarterly smart contract audit with 0 critical vulnerabilities found.",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 24 hours ago
    mitigation: "Audit report published and verified on Midnight ledger.",
    isResolved: true,
  }
];

export const INITIAL_WHALE_EVENTS: WhaleActivityEvent[] = [
  {
    id: "whale-101",
    bridgeName: "LayerZero Gateway",
    destinationChain: "Ethereum",
    proofNonce: "#983421",
    anonymizedTier: "Tier 3 ($2M+)",
    verdict: "SAFE",
    timestamp: Date.now() - 1000 * 60 * 12,
    zkCommitment: "0x7a2...f81c",
  },
  {
    id: "whale-102",
    bridgeName: "Stargate Router",
    destinationChain: "Arbitrum",
    proofNonce: "#983420",
    anonymizedTier: "Tier 2 ($500k+)",
    verdict: "SAFE",
    timestamp: Date.now() - 1000 * 60 * 28,
    zkCommitment: "0x3e1...b42a",
  },
  {
    id: "whale-103",
    bridgeName: "Wormhole Bridge",
    destinationChain: "Solana",
    proofNonce: "#983419",
    anonymizedTier: "Mega Whale ($10M+)",
    verdict: "CAUTION",
    timestamp: Date.now() - 1000 * 60 * 55,
    zkCommitment: "0x9c4...119d",
  },
  {
    id: "whale-104",
    bridgeName: "Axelar Network",
    destinationChain: "Cosmos",
    proofNonce: "#983418",
    anonymizedTier: "Tier 1 ($100k+)",
    verdict: "SAFE",
    timestamp: Date.now() - 1000 * 60 * 75,
    zkCommitment: "0x1d5...a76e",
  }
];

export function calculateCompositeSecurityScore(bridge: BridgeInfo): number {
  let score = 100;
  
  // Deductions based on base risk score
  score -= (bridge.baseRiskScore / 100) * 0.4;
  
  // Incident deduction
  score -= bridge.incidentCount * 8;
  
  // Audit tier bonus/penalty
  if (bridge.auditTier === 2) score += 5;
  else if (bridge.auditTier === 0) score -= 25;
  
  // TVL depth bonus
  if (bridge.tvl > 500_000_000) score += 5;
  
  return Math.max(10, Math.min(99, Math.round(score)));
}
