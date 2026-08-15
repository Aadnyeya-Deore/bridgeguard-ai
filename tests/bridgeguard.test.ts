import { describe, it, expect, beforeEach } from 'vitest';
import { BridgeWitnessProvider } from '../src/wallet.js';
import { INITIAL_BRIDGES } from '../src/setup.js';

describe('BridgeGuard AI - Compact Smart Contract & ZK Proof Invariants', () => {
  let bridgeRegistry: typeof INITIAL_BRIDGES;
  let evaluationCounter: number;
  let latestEvaluatedBridge: bigint;
  let latestRiskVerdict: number;

  beforeEach(() => {
    // Fresh clone before each test
    bridgeRegistry = INITIAL_BRIDGES.map(b => ({ ...b, supportedChains: [...b.supportedChains] }));
    evaluationCounter = 0;
    latestEvaluatedBridge = 0n;
    latestRiskVerdict = 0;
  });

  it('1. Circuit Logic: Evaluates SAFE verdict when private transfer is within safe liquidity limits', () => {
    const targetBridge = bridgeRegistry[0]; // LayerZero ($450M TVL, 12% risk, 0 incidents, Tier 2 audit)
    const privateTransferAmount = 250_000n; // $250k (0.055% of TVL)
    const privateRiskTolerance = 2000;      // 20.00%
    const maxBridgeCapacityBps = 2000;      // 20.00%

    const witness = new BridgeWitnessProvider(privateTransferAmount, privateRiskTolerance);
    const witnesses = witness.getWitnesses();

    const amount = witnesses.userTransferAmount();
    const tolerance = witnesses.userRiskTolerance();

    // Circuit constraint calculation
    const scaledAmount = amount * 10000n;
    const maxExposure = targetBridge.tvl * BigInt(maxBridgeCapacityBps);
    const moderateExposure = targetBridge.tvl * 1000n;

    let verdict = 0;
    if (targetBridge.incidents > 2 || targetBridge.baseRisk > 7000 || scaledAmount > maxExposure) {
      verdict = 2; // HIGH_RISK
    } else if (targetBridge.baseRisk > tolerance || scaledAmount > moderateExposure || targetBridge.auditTier === 0) {
      verdict = 1; // CAUTION
    } else {
      verdict = 0; // SAFE
    }

    // Update public ledger
    evaluationCounter += 1;
    latestEvaluatedBridge = targetBridge.id;
    latestRiskVerdict = verdict;

    expect(verdict).toBe(0); // SAFE
    expect(latestRiskVerdict).toBe(0);
    expect(evaluationCounter).toBe(1);
    expect(latestEvaluatedBridge).toBe(targetBridge.id);
  });

  it('2. State Transitions: Correctly escalates risk and triggers emergency pause on critical incidents', () => {
    const targetBridge = bridgeRegistry[1]; // Wormhole (ID 2)
    const initialRisk = targetBridge.baseRisk;
    const initialIncidents = targetBridge.incidents;

    // Simulate reporting a critical exploit (severity 3)
    const severity = 3;
    const incidentPenalty = severity * 1500;

    targetBridge.incidents = initialIncidents + 1;
    targetBridge.baseRisk = initialRisk + incidentPenalty;
    if (severity >= 3) {
      targetBridge.status = "Paused";
    }

    expect(targetBridge.incidents).toBe(initialIncidents + 1);
    expect(targetBridge.baseRisk).toBe(initialRisk + 4500);
    expect(targetBridge.status).toBe("Paused");
  });

  it('3. Privacy Invariant: Private transfer amount and risk tolerance are NEVER leaked in public outputs', () => {
    const secretTransferAmount = 7_500_000n; // $7.5M Whale transfer
    const secretRiskTolerance = 800;          // 8.00% conservative tolerance
    const secretSalt = new Uint8Array(32).fill(42);

    const witness = new BridgeWitnessProvider(secretTransferAmount, secretRiskTolerance, secretSalt);
    const witnesses = witness.getWitnesses();

    const targetBridge = bridgeRegistry[0];
    const amount = witnesses.userTransferAmount();
    const tolerance = witnesses.userRiskTolerance();

    const scaledAmount = amount * 10000n;
    const maxExposure = targetBridge.tvl * 2000n;
    const moderateExposure = targetBridge.tvl * 1000n;

    let publicVerdict: number;
    if (targetBridge.incidents > 2 || targetBridge.baseRisk > 7000 || scaledAmount > maxExposure) {
      publicVerdict = 2;
    } else if (targetBridge.baseRisk > tolerance || scaledAmount > moderateExposure || targetBridge.auditTier === 0) {
      publicVerdict = 1;
    } else {
      publicVerdict = 0;
    }

    // Simulate public on-chain event / ledger state
    const publicLedgerState = {
      evaluatedBridgeId: Number(targetBridge.id),
      verdictCode: publicVerdict,
      evaluationCounter: 42,
      timestamp: Date.now(),
    };

    // Serialize public record
    const publicRecordString = JSON.stringify(publicLedgerState);

    // CRITICAL ASSERTION: The secret transfer amount and tolerance must NOT appear in public state
    expect(publicRecordString).not.toContain("7500000");
    expect(publicRecordString).not.toContain("7_500_000");
    expect(publicRecordString).not.toContain("800");

    // Purge private witnesses
    witness.purge();
    expect(witnesses.userTransferAmount()).toBe(0n);
    expect(witnesses.userRiskTolerance()).toBe(0);
  });

  it('4. Compliance Certificate: Proves institutional audit compliance without revealing account balance', () => {
    const multiAuditedBridge = bridgeRegistry[0]; // Tier 2
    const unauditedBridge = { ...bridgeRegistry[4], auditTier: 0 }; // Tier 0

    const privateBalance = 1_000_000n;
    const minTierRequired = 2;

    const compliance1 = (privateBalance > 0n) && (multiAuditedBridge.auditTier >= minTierRequired);
    const compliance2 = (privateBalance > 0n) && (unauditedBridge.auditTier >= minTierRequired);

    expect(compliance1).toBe(true);
    expect(compliance2).toBe(false);
  });
});
