/**
 * Midnight Wallet Utilities for BridgeGuard AI
 */
import * as crypto from 'crypto';

export interface WalletCredentials {
  seed: string;
  address: string;
  network: string;
}

export interface PrivateWitnessState {
  userTransferAmount: bigint;
  userRiskTolerance: number;
  userSecretSalt: Uint8Array;
}

export class BridgeWitnessProvider {
  private transferAmount: bigint;
  private riskTolerance: number;
  private secretSalt: Uint8Array;

  constructor(transferAmount: bigint, riskTolerance: number, secretSalt?: Uint8Array) {
    this.transferAmount = transferAmount;
    this.riskTolerance = riskTolerance;
    this.secretSalt = secretSalt || crypto.randomBytes(32);
  }

  getWitnesses() {
    return {
      userTransferAmount: () => this.transferAmount,
      userRiskTolerance: () => this.riskTolerance,
      userSecretSalt: () => this.secretSalt,
    };
  }

  // Ensure private witness data is dropped after proof generation
  purge() {
    this.transferAmount = 0n;
    this.riskTolerance = 0;
    this.secretSalt.fill(0);
  }
}

export const generateRandomSeed = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
