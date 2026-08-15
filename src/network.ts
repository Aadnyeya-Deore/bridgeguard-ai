/**
 * Midnight Network Configuration for BridgeGuard AI
 */

export interface NetworkConfig {
  networkId: string;
  indexerUrl: string;
  indexerWsUrl: string;
  nodeUrl: string;
  proofServerUrl: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  preview: {
    networkId: "preview",
    indexerUrl: process.env.VITE_INDEXER_URL || "https://indexer.preview.midnight.network/api/v1/graphql",
    indexerWsUrl: process.env.VITE_INDEXER_WS_URL || "wss://indexer.preview.midnight.network/api/v1/graphql/ws",
    nodeUrl: process.env.VITE_NODE_URL || "https://rpc.preview.midnight.network",
    proofServerUrl: process.env.PROOF_SERVER_URL || "http://localhost:6300",
  },
  local: {
    networkId: "local",
    indexerUrl: "http://localhost:8088/api/v1/graphql",
    indexerWsUrl: "ws://localhost:8088/api/v1/graphql/ws",
    nodeUrl: "http://localhost:9944",
    proofServerUrl: "http://localhost:6300",
  }
};

export const getNetworkConfig = (networkName: string = process.env.NETWORK || "preview"): NetworkConfig => {
  return NETWORKS[networkName] || NETWORKS.preview;
};
