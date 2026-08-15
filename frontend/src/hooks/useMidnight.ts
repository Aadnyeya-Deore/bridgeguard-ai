import { useState, useEffect, useCallback } from 'react';
import { WalletState } from '../types';

type ConnectedWallet = {
  getConnectionStatus?: () => Promise<{
    networkId?: string;
    [key: string]: unknown;
  }>;
  getConfiguration?: () => Promise<{
    networkId?: string;
    indexerUri?: string;
    indexerWsUri?: string;
    proverServerUri?: string;
    substrateNodeUri?: string;
  }>;
  getUnshieldedAddress?: () => Promise<string>;
  getShieldedAddresses?: () => Promise<{
    unshieldedAddress?: string;
    shieldedAddress?: string;
    unshielded?: string;
    shielded?: string;
  }>;
  getUnshieldedBalances?: () => Promise<Record<string, unknown>>;
  getDustBalance?: () => Promise<unknown>;
  submitTransaction?: (tx: unknown) => Promise<string>;
};

type MidnightWallet = {
  name: string;
  apiVersion: string;
  icon?: string;
  rdns?: string;
  connect: (networkId: string) => Promise<ConnectedWallet>;
};

declare global {
  interface Window {
    midnight?: Record<string, MidnightWallet>;
  }
}

const EXPECTED_NETWORK =
  import.meta.env.VITE_NETWORK || 'preview';

export function useMidnight() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    network: null,
    error: null,
    walletName: null,
  });

  const [availableWallets, setAvailableWallets] = useState<
    Array<{ name: string; key: string }>
  >([]);

  /**
   * Discover Midnight-compatible wallets injected by browser extensions.
   *
   * Midnight wallets expose their DApp Connector API through:
   * window.midnight.<walletId>
   */
  const discoverWallets = useCallback(() => {
    if (typeof window === 'undefined' || !window.midnight) {
      setAvailableWallets([]);
      return [];
    }

    const wallets = Object.entries(window.midnight)
      .filter(([, wallet]) => wallet && typeof wallet.connect === 'function')
      .map(([key, wallet]) => ({
        key,
        name: wallet.name || key,
      }));

    setAvailableWallets(wallets);

    return wallets;
  }, []);

  useEffect(() => {
    discoverWallets();

    // Lace can inject after the page has loaded.
    const timers = [
      setTimeout(discoverWallets, 500),
      setTimeout(discoverWallets, 1500),
      setTimeout(discoverWallets, 3000),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [discoverWallets]);

  /**
   * Connect to Lace / another Midnight-compatible wallet.
   */
  const connect = useCallback(
    async (preferredKey?: string) => {
      setWalletState((prev) => ({
        ...prev,
        isConnecting: true,
        error: null,
      }));

      try {
        if (
          typeof window === 'undefined' ||
          !window.midnight ||
          Object.keys(window.midnight).length === 0
        ) {
          throw new Error(
            'No Midnight wallet detected. Please install/open Lace Wallet, enable Midnight, select Preview, then refresh this page.'
          );
        }

        const wallets = Object.entries(window.midnight).filter(
          ([, wallet]) =>
            wallet && typeof wallet.connect === 'function'
        );

        if (wallets.length === 0) {
          throw new Error(
            'No Midnight-compatible wallet found. Make sure the Midnight-compatible Lace Wallet extension is installed and enabled.'
          );
        }

        const preferredEntry = preferredKey
  ? wallets.find(([key]) => key === preferredKey)
  : undefined;

const selectedEntry =
  preferredEntry ??
  wallets.find(([key, wallet]) =>
    /lace/i.test(wallet.name) || /lace/i.test(key)
  ) ??
  wallets[0];

        if (!selectedEntry) {
          throw new Error('No compatible Midnight wallet was selected.');
        }

        const [walletKey, wallet] = selectedEntry;

        console.log(
          `Connecting to ${wallet.name} on Midnight ${EXPECTED_NETWORK}...`
        );

        /**
         * IMPORTANT:
         * Current Midnight DApp Connector API uses connect(networkId),
         * not provider.enable().
         */
        const connected = await wallet.connect(EXPECTED_NETWORK);

        let detectedNetwork = EXPECTED_NETWORK;

        // Verify the network using the connected wallet configuration.
        if (connected.getConfiguration) {
          try {
            const configuration = await connected.getConfiguration();

            if (configuration?.networkId) {
              detectedNetwork = configuration.networkId;
            }
          } catch (configurationError) {
            console.warn(
              'Could not read wallet configuration:',
              configurationError
            );
          }
        }

        // Also check connection status when available.
        if (connected.getConnectionStatus) {
          try {
            const status = await connected.getConnectionStatus();

            if (status?.networkId) {
              detectedNetwork = status.networkId;
            }
          } catch (statusError) {
            console.warn(
              'Could not read wallet connection status:',
              statusError
            );
          }
        }

        if (
          detectedNetwork &&
          detectedNetwork.toLowerCase() !==
            EXPECTED_NETWORK.toLowerCase()
        ) {
          throw new Error(
            `Network mismatch: Lace is connected to '${detectedNetwork}', but BridgeGuard requires '${EXPECTED_NETWORK}'. Please select Midnight ${EXPECTED_NETWORK} in Lace and try again.`
          );
        }

        let address: string | null = null;

        if (connected.getUnshieldedAddress) {
          address = await connected.getUnshieldedAddress();
        }

        if (!address && connected.getShieldedAddresses) {
          const addresses =
            await connected.getShieldedAddresses();

          address =
            addresses.unshieldedAddress ||
            addresses.unshielded ||
            addresses.shieldedAddress ||
            addresses.shielded ||
            null;
        }

        if (!address) {
          throw new Error(
            'Connected to Lace, but no Midnight wallet address was returned.'
          );
        }

        setWalletState({
          isConnected: true,
          isConnecting: false,
          address,
          network: detectedNetwork,
          error: null,
          walletName: wallet.name || walletKey,
        });

        console.log('Midnight wallet connected:', {
          wallet: wallet.name,
          network: detectedNetwork,
          address,
        });
      } catch (err: unknown) {
        console.error('Midnight wallet connection failed:', err);

        const message =
          err instanceof Error
            ? err.message
            : 'Failed to connect to Midnight Wallet';

        setWalletState({
          isConnected: false,
          isConnecting: false,
          address: null,
          network: null,
          error: message,
          walletName: null,
        });
      }
    },
    []
  );

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
    setWalletState((prev) => ({
      ...prev,
      error: null,
    }));
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