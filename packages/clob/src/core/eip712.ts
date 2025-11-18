import type { Hex } from "viem";
import type { Order, OrderSide } from "../api/order.js";
import type { ConnectedWalletClient } from "../wallet/wallet.js";
import { getContractForChain } from "./contracts.js";

export type SignatureType = "eoa" | "poly-proxy" | "poly-gnosis-safe";

/**
 * Sign an order using EIP-712
 */
export async function signOrder(
  wallet: ConnectedWalletClient,
  order: Order,
): Promise<string> {
  const contract = getContractForChain(wallet.chain.id);

  return wallet.signTypedData({
    primaryType: "Order",
    domain: {
      name: "Polymarket CTF Exchange",
      version: "1",
      chainId: BigInt(wallet.chain.id),
      // TODO: allow to switch between negRiskExchange or risk exchange
      verifyingContract: contract.negRiskExchange as Hex,
    },
    // EIP-712 Type definitions for Polymarket orders
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      Order: [
        { name: "salt", type: "uint256" },
        { name: "maker", type: "address" },
        { name: "signer", type: "address" },
        { name: "taker", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "makerAmount", type: "uint256" },
        { name: "takerAmount", type: "uint256" },
        { name: "expiration", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "feeRateBps", type: "uint256" },
        { name: "side", type: "uint8" },
        { name: "signatureType", type: "uint8" },
      ],
    },
    message: {
      salt: BigInt(order.salt),
      signer: order.signer,
      maker: order.maker,
      taker: order.taker,
      tokenId: BigInt(order.tokenId),
      nonce: BigInt(order.nonce),
      feeRateBps: BigInt(order.feeRateBps),
      expiration: BigInt(order.expiration),
      side: orderSideToNumber(order.side),
      signatureType: signatureTypeToNumber(order.signatureType),
      makerAmount: BigInt(order.makerAmount),
      takerAmount: BigInt(order.takerAmount),
    },
  });
}

/**
 * Signs the canonical Polymarket CLOB EIP-712 authentication message
 *
 * @param signer - Viem wallet client
 * @param timestamp - Timestamp for the signature
 * @param nonce - Nonce for the signature
 * @returns EIP-712 signature
 */
export async function signClobAuth({
  signer,
  timestamp,
  nonce,
}: {
  signer: ConnectedWalletClient;
  timestamp: number;
  nonce: bigint;
}): Promise<Hex> {
  return signer.signTypedData({
    domain: {
      name: "ClobAuthDomain",
      version: "1",
      chainId: signer.chain.id,
    },
    types: {
      ClobAuth: [
        { name: "address", type: "address" },
        { name: "timestamp", type: "string" },
        { name: "nonce", type: "uint256" },
        { name: "message", type: "string" },
      ],
    },
    primaryType: "ClobAuth",
    message: {
      address: signer.account.address,
      timestamp: timestamp.toString(),
      nonce,
      message: "This message attests that I control the given wallet",
    },
  });
}

function signatureTypeToNumber(signatureType: SignatureType): 0 | 1 | 2 {
  switch (signatureType) {
    case "eoa":
      return 0;
    case "poly-proxy":
      return 1;
    case "poly-gnosis-safe":
      return 2;
  }
}

function orderSideToNumber(side: OrderSide): 0 | 1 {
  return side === "BUY" ? 0 : 1;
}
