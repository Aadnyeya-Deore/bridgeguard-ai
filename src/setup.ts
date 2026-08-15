/**
 * BridgeGuard AI Setup Script
 * Prepares initial bridge registry and validates Compact compilation artifacts.
 */
import * as fs from 'fs';
import * as path from 'path';

export const INITIAL_BRIDGES = [
  {
    id: 1n,
    name: "LayerZero Omnichain Gateway",
    tvl: 450_000_000n, // $450M
    baseRisk: 1200,    // 12.00%
    auditTier: 2,      // Multi-audited (Zellic, OtterSec)
    incidents: 0,
    supportedChains: ["Midnight", "Cardano", "Ethereum", "Arbitrum", "Polygon"],
    status: "Active"
  },
  {
    id: 2n,
    name: "Wormhole Core Bridge",
    tvl: 680_000_000n, // $680M
    baseRisk: 2100,    // 21.00%
    auditTier: 2,      // Multi-audited (Neodyme, Kudelski)
    incidents: 1,      // Historical patch verified
    supportedChains: ["Midnight", "Ethereum", "Solana", "Avalanche", "Sui"],
    status: "Active"
  },
  {
    id: 3n,
    name: "Axelar Interchain Network",
    tvl: 320_000_000n, // $320M
    baseRisk: 1400,    // 14.00%
    auditTier: 2,      // Multi-audited (NCC Group, Cure53)
    incidents: 0,
    supportedChains: ["Midnight", "Cosmos", "Osmosis", "Ethereum", "BNB Chain"],
    status: "Active"
  },
  {
    id: 4n,
    name: "Stargate Liquidity Router",
    tvl: 510_000_000n, // $510M
    baseRisk: 1600,    // 16.00%
    auditTier: 2,      // Multi-audited (Quantstamp, Halborn)
    incidents: 0,
    supportedChains: ["Midnight", "Ethereum", "Optimism", "Base", "Arbitrum"],
    status: "Active"
  },
  {
    id: 5n,
    name: "Celer cBridge",
    tvl: 180_000_000n, // $180M
    baseRisk: 2800,    // 28.00%
    auditTier: 1,      // Audited (CertiK)
    incidents: 1,
    supportedChains: ["Midnight", "Ethereum", "Fantom", "BNB Chain"],
    status: "Active"
  }
];

export async function setup() {
  console.log("==================================================");
  console.log("🛡️  BridgeGuard AI - Platform Setup & Verification");
  console.log("==================================================");

  const managedPath = path.resolve(process.cwd(), "managed", "bridgeguard", "contract");
  if (!fs.existsSync(managedPath)) {
    console.warn("⚠️  Managed contract directory not found. Please run 'npm run compile' first.");
  } else {
    console.log("✅ Compact contract artifacts verified in managed/bridgeguard");
  }

  console.log(`\n📋 Loaded ${INITIAL_BRIDGES.length} canonical bridge definitions for registration.`);
  INITIAL_BRIDGES.forEach((b) => {
    console.log(`   - [Bridge #${b.id}] ${b.name} (TVL: $${Number(b.tvl).toLocaleString()}, Risk: ${b.baseRisk / 100}%, Audit Tier: ${b.auditTier})`);
  });

  console.log("\n✅ Setup complete. Ready for deployment or local execution.");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setup().catch(console.error);
}
