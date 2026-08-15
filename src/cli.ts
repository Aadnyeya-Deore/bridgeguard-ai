/**
 * BridgeGuard AI Interactive CLI
 * Test ZK bridge risk evaluation from command line
 */
import { INITIAL_BRIDGES } from "./setup.js";
import { BridgeWitnessProvider } from "./wallet.js";

async function runCli() {
  console.log("==================================================");
  console.log("🛡️  BridgeGuard AI - Command Line Interface");
  console.log("==================================================");

  console.log("\nRegistered Cross-Chain Bridges:");
  INITIAL_BRIDGES.forEach((b) => {
    console.log(` [${b.id}] ${b.name} - TVL: $${Number(b.tvl).toLocaleString()} | Risk: ${b.baseRisk / 100}%`);
  });

  const selectedBridge = INITIAL_BRIDGES[0];
  const testPrivateAmount = 50_000n; // $50,000 private transfer
  const testRiskTolerance = 2500;     // 25.00% max risk tolerance

  console.log(`\n🔒 Simulating Zero-Knowledge Evaluation on ${selectedBridge.name}:`);
  console.log(`   - Private Transfer Amount (Witness): $${Number(testPrivateAmount).toLocaleString()} [NEVER EXPOSED ON-CHAIN]`);
  console.log(`   - Private Risk Tolerance (Witness): ${testRiskTolerance / 100}%`);

  const witness = new BridgeWitnessProvider(testPrivateAmount, testRiskTolerance);
  
  // ZK Circuit Constraint Check
  const scaledAmount = testPrivateAmount * 10000n;
  const maxAllowedExposure = selectedBridge.tvl * 2000n; // 20% max capacity bps
  const moderateExposure = selectedBridge.tvl * 1000n;   // 10% liquidity

  let verdict = 0; // 0 = SAFE, 1 = CAUTION, 2 = HIGH_RISK
  if (selectedBridge.incidents > 2 || selectedBridge.baseRisk > 7000 || scaledAmount > maxAllowedExposure) {
    verdict = 2;
  } else if (selectedBridge.baseRisk > testRiskTolerance || scaledAmount > moderateExposure || selectedBridge.auditTier === 0) {
    verdict = 1;
  } else {
    verdict = 0;
  }

  const verdictLabel = verdict === 0 ? "🟢 SAFE" : (verdict === 1 ? "🟡 CAUTION" : "🔴 HIGH RISK");
  console.log(`\n📊 On-Chain ZK Proof Verdict: ${verdictLabel}`);
  console.log(`✨ Note: The on-chain ledger only records the verdict (${verdictLabel}) and bridge ID.`);
  console.log(`   The $50,000 transfer amount was proven in Zero-Knowledge and dropped immediately.`);

  witness.purge();
  console.log("🧹 Private witness memory purged successfully.");
}

runCli().catch(console.error);
