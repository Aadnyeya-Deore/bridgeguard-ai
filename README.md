# BridgeGuard AI

BridgeGuard AI is a privacy-preserving cross-chain bridge security platform and AI Transfer Advisory suite built on the **Midnight Network**. Users connect their Lace Wallet, select a registered blockchain bridge, and enter a private transfer amount and risk tolerance. Using Midnight **Compact smart contracts** and **Zero-Knowledge proofs (ZKP)**, BridgeGuard AI evaluates bridge liquidity depth, audit integrity, and incident history to return an on-chain risk score, a `SAFE` / `CAUTION` / `HIGH RISK` verdict, and tailored AI transfer recommendations—all without exposing the user's private transfer amount on-chain.

## Project Vision
Public cross-chain bridges today broadcast high-volume "whale" transfer amounts in plaintext to public mempools and block explorers, making users prime targets for MEV sandwich attacks, predatory arbitrage, and bridge liquidity draining exploits. BridgeGuard AI solves this by decoupling risk assessment from transaction transparency: using Midnight's zero-knowledge architecture, users prove that their intended transfer respects liquidity safety buffers and risk limits without revealing whether they are bridging $500 or $5,000,000. Privacy is not merely an optional feature—it is the cryptographic foundation that makes institutional-grade cross-chain bridging safe from adversarial surveillance.

## Smart Contract Deployment
- **Network:** Preview
- **Deployed contract ID:** `0x7b9c3f5a8e1d2c4b6a9f0e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b`

## Key Features
- **Zero-Knowledge Bridge Risk Evaluator:** Evaluates target bridge liquidity, base risk scores, and past exploits in Zero-Knowledge without broadcasting the user's private transfer amount (`userTransferAmount`) or risk tolerance (`userRiskTolerance`).
- **Cryptographic Privacy Guarantee ("Proved without revealing your input"):** All private witness parameters are processed locally within the user's wallet sandbox, verified against Compact circuit constraints, and dropped immediately after proof generation.
- **AI Transfer Advisor & MEV Insulation:** Generates intelligent routing recommendations, optimal batch-chunk sizing, and an MEV front-running resistance score for each verified route.
- **On-Chain Bridge Registry & Liquidity Monitor:** Live registry of verified cross-chain bridges (LayerZero, Wormhole, Axelar, Stargate, Celer, Hyperlane) tracking real-time TVL, multi-audit certifications (Zellic, OpenZeppelin, OtterSec, Quantstamp), and incident counters.
- **Whale Activity & Threat Radar:** Anonymized, aggregate stream displaying zero-knowledge proof commitments and risk classifications without revealing wallet addresses or exact volumes.
- **Real-Time Security Alerts Console:** Live incident feed, exploit warnings, and smart contract circuit-breaker pause statuses.
- **Lace DApp Connector Integration:** Native wallet connection supporting the Midnight Preview Network with dynamic wallet discovery, unshielded address display, and network mismatch validation.

## Future Scope
- **Automated ZK Insurance Vaults:** Smart contract-driven escrow pools that provide decentralized insurance payouts for high-volume transfers routed through verified `SAFE` bridges.
- **Multi-Chain Intent Relayers:** Trustless cross-chain transaction relayers that automatically execute transfers upon zero-knowledge compliance verification on Midnight.
- **Machine Learning Oracle Feed:** Decentralized oracles feeding real-time on-chain mempool anomaly signals directly into the Compact contract's risk multipliers.
- **Mainnet Launch Roadmap:** Production security audits with Zellic/OtterSec and transition from Preview to Midnight Mainnet.

## Tech Stack
- **Smart Contracts:** Midnight Compact Smart Contract Language (`bridgeguard.compact`)
- **ZK Proving & Ledger:** Midnight JS SDK, `@midnight-ntwrk/compact-runtime`, Midnight Proof Server (`:6300`), Midnight Indexer (`:8088`)
- **Frontend Framework:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React
- **DApp Connector:** Lace Wallet DApp Connector API (`window.midnight`)
- **Testing & Tooling:** Vitest, tsx, Docker Compose

## Local Development (setup, run, test — step by step commands)

### 1. Prerequisites
Ensure you have Node.js (v18+ or v22+), npm, Git, and Docker Desktop installed.

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Compile Compact Smart Contract
```bash
# Compiles bridgeguard.compact and generates TypeScript bindings in managed/
npm run compile
```

### 4. Run Test Suite
```bash
# Runs Vitest tests verifying circuit constraints and private input isolation
npm run test
```

### 5. Deploy Smart Contract to Preview Network
```bash
# Deploy to Midnight Preview Network
npm run deploy -- --network preview
```
*Note: If your deployer wallet requires funding, request testnet tDUST from the official [Midnight Preview Faucet](https://faucet.preview.midnight.network/).*

### 6. Start Local Devnet (Optional)
```bash
# Starts local Midnight node, indexer, and proof-server
docker compose up -d
```

### 7. Run the Frontend Application
```bash
# Start the Vite development server
npm run frontend:dev
```
Open your browser at `http://localhost:5173` to interact with BridgeGuard AI.
