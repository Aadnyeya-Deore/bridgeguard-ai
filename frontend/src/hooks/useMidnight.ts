import { useState, useEffect, useCallback } from 'react';
import { WalletState } from '../types';

declare global {
  interface Window {
    midnight?: Record<string, {
      name: string;
      apiVersion: string;
      icon?: string;
      rdns?: string;
      enable: () => Promise<{
        getConnectionStatus: () => Promise<boolean>;
        getNetworkId?: () => Promise<string>;
        getUnshieldedAddress?: () => Promise<string>;
        getShieldedAddresses?: () => Promise<{ unshielded?: string; shielded?: string }>;
        submitTx?: (tx: unknown) => Promise<string>;
      }>;
      isEnabled: () => Promise<boolean>;
    }>;
  }
}

const EXPECTED_NETWORK = import.meta.env.VITE_NETWORK || 'preview';

export function useMidnight() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    network: null,
    error: null,
    walletName: null,
  });

  const [availableWallets, setAvailableWallets] = useState<Array<{ name: string; key: string }>>([]);

  // Discover available Midnight wallets dynamically
  const discoverWallets = useCallback(() => {
    if (typeof window !== 'undefined' && window.midnight) {
      const wallets = Object.entries(window.midnight).map(([key, provider]) => ({
        key,
        name: provider?.name || key,
      }));
      setAvailableWallets(wallets);
      return wallets;
    }
    return [];
  }, []);

  useEffect(() => {
    discoverWallets();
    const timer = setTimeout(discoverWallets, 1000);
    return () => clearTimeout(timer);
  }, [discoverWallets]);

  // Connect to the detected Lace / Midnight wallet
  const connect = useCallback(async (preferredKey?: string) => {
    setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (typeof window === 'undefined' || !window.midnight || Object.keys(window.midnight).length === 0) {
        // Fallback for demonstration / local testing when browser extension is not yet loaded
        const mockAddress = "mn1q_preview_" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        setWalletState({
          isConnected: true,
          isConnecting: false,
          address: mockAddress,
          network: EXPECTED_NETWORK,
          error: null,
          walletName: "Lace (Simulated Preview)",
        });
        return;
      }

      // Discover through Object.values(window.midnight)
      const providers = Object.entries(window.midnight);
      const selectedEntry = preferredKey 
        ? providers.find(([key]) => key === preferredKey) 
        : providers[0];

      if (!selectedEntry) {
        throw new Error("No Midnight-compatible wallet provider found.");
      }

      const [key, provider] = selectedEntry;
      const api = await provider.enable();

      let detectedNetwork = EXPECTED_NETWORK;
      if (api.getNetworkId) {
        try {
          detectedNetwork = await api.getNetworkId();
        } catch {
          detectedNetwork = EXPECTED_NETWORK;
        }
      }

      // Validate connected network
      if (detectedNetwork && detectedNetwork.toLowerCase() !== EXPECTED_NETWORK.toLowerCase()) {
        throw new Error(`Network mismatch: Wallet is on '${detectedNetwork}', but DApp requires Midnight '${EXPECTED_NETWORK}'. Please switch network in your wallet.`);
      }

      let address = "mn1q_preview_bridgeguard_user";
      if (api.getUnshieldedAddress) {
        address = await api.getUnshieldedAddress();
      } else if (api.getShieldedAddresses) {
        const addrs = await api.getShieldedAddresses();
        address = addrs.unshielded || addrs.shielded || address;
      }

      setWalletState({
        isConnected: true,
        isConnecting: false,
        address,
        network: detectedNetwork,
        error: null,
        walletName: provider.name || key,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to connect to Midnight Wallet";
      setWalletState({
        isConnected: false,
        isConnecting: false,
        address: null,
        network: null,
        error: message,
        walletName: null,
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletState({
      isConnected: false,
      isConnecting: false,
      address: null,
      network: null,
      error: null,
      walletName: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setWalletState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...walletState,
    expectedNetwork: EXPECTED_NETWORK,
    availableWallets,
    connect,
    disconnect,
    clearError,
    refreshWallets: discoverWallets,
  };
}
