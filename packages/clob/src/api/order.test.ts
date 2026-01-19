import { describe, expect, mock, test } from "bun:test";
import { ValidationError } from "@dicedhq/core";
import type { Hex } from "viem";
import type { BaseClient } from "../client/base.js";
import { signatureTypeToNumber } from "../core/eip712.js";
import type { MarketApi } from "./market.js";
import { OrderApi, type SignedOrder } from "./order.js";

const mockClient = {
  request: () => {
    throw new Error("Request should not be called - validation should fail");
  },
} as unknown as BaseClient;

describe("OrderApi Input Validation", () => {
  const mockMarketApi = {} as MarketApi;
  const api = new OrderApi(mockClient, mockMarketApi);

  describe("getOrder", () => {
    test("should reject empty id", () => {
      expect(api.getOrder("")).rejects.toThrow(ValidationError);
    });
  });

  describe("listOrders", () => {
    test("should reject empty marketId", () => {
      expect(api.listOrders({ marketId: "" })).rejects.toThrow(ValidationError);
    });
  });

  describe("checkOrderRewardScoring", () => {
    test("should reject empty id", () => {
      expect(api.checkOrderRewardScoring("")).rejects.toThrow(ValidationError);
    });
  });

  describe("cancelOrder", () => {
    test("should reject empty id", () => {
      expect(api.cancelOrder("")).rejects.toThrow(ValidationError);
    });
  });

  describe("cancelOrders", () => {
    test("should reject empty array", () => {
      expect(api.cancelOrders([])).rejects.toThrow(ValidationError);
    });

    test("should reject array with empty strings", () => {
      expect(api.cancelOrders(["order1", ""])).rejects.toThrow(ValidationError);
    });
  });

  describe("createOrder", () => {
    test("should reject empty tokenId", () => {
      expect(
        api.createOrder({
          tokenId: "",
          price: 0.5,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject zero price", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject negative price", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: -1,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject zero size", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 0,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject invalid side", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 10,
          side: "HOLD" as "BUY",
          expiration: 0,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject negative expiration", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 10,
          side: "BUY",
          expiration: -1,
          taker: "anyone",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject invalid taker address", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "invalid",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject invalid funderAddress (not starting with 0x)", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
          funderAddress: "invalid-address",
        }),
      ).rejects.toThrow(ValidationError);
    });

    test("should reject invalid signatureType", () => {
      expect(
        api.createOrder({
          tokenId: "token123",
          price: 0.5,
          size: 10,
          side: "BUY",
          expiration: 0,
          taker: "anyone",
          signatureType: "invalid" as "eoa",
        }),
      ).rejects.toThrow(ValidationError);
    });
  });
});

describe("signatureTypeToNumber", () => {
  test("should return 0 for eoa", () => {
    expect(signatureTypeToNumber("eoa")).toBe(0);
  });

  test("should return 1 for poly-proxy", () => {
    expect(signatureTypeToNumber("poly-proxy")).toBe(1);
  });

  test("should return 2 for poly-gnosis-safe", () => {
    expect(signatureTypeToNumber("poly-gnosis-safe")).toBe(2);
  });
});

describe("OrderApi createOrder behavior", () => {
  const signerAddress = "0x1234567890123456789012345678901234567890" as Hex;
  const funderAddress = "0xABCDEF1234567890123456789012345678901234" as Hex;
  // Use a valid numeric tokenId that can be parsed as BigInt
  const tokenId =
    "48331043336612883890938759509493159234702721395746534906027558071024163372528";

  const createMockClient = () => {
    return {
      wallet: {
        account: {
          address: signerAddress,
          getNonce: async () => 0n,
        },
        chain: { id: 137 },
        signTypedData: mock(async () => "0xmocksignature"),
      },
      credentials: { key: "test-key" },
      request: mock(async () => ({})),
    } as unknown as BaseClient;
  };

  const createMockMarketApi = (tickSize = "0.01") => {
    return {
      getTickSize: mock(async () => tickSize),
      getFeeRateBps: mock(async () => 0),
    } as unknown as MarketApi;
  };

  test("should use wallet address as both signer and maker when funderAddress not provided", async () => {
    const mockClient = createMockClient();
    const mockMarketApi = createMockMarketApi();
    const api = new OrderApi(mockClient, mockMarketApi);

    const order = await api.createOrder({
      tokenId,
      price: 0.5,
      size: 10,
      side: "BUY",
      expiration: 0,
      taker: "anyone",
    });

    expect(order.signer).toBe(signerAddress);
    expect(order.maker).toBe(signerAddress);
    expect(order.signatureType).toBe("eoa");
  });

  test("should use funderAddress as maker when provided", async () => {
    const mockClient = createMockClient();
    const mockMarketApi = createMockMarketApi();
    const api = new OrderApi(mockClient, mockMarketApi);

    const order = await api.createOrder({
      tokenId,
      price: 0.5,
      size: 10,
      side: "BUY",
      expiration: 0,
      taker: "anyone",
      funderAddress,
    });

    expect(order.signer).toBe(signerAddress);
    expect(order.maker).toBe(funderAddress);
  });

  test("should use poly-gnosis-safe signatureType when specified", async () => {
    const mockClient = createMockClient();
    const mockMarketApi = createMockMarketApi();
    const api = new OrderApi(mockClient, mockMarketApi);

    const order = await api.createOrder({
      tokenId,
      price: 0.5,
      size: 10,
      side: "BUY",
      expiration: 0,
      taker: "anyone",
      funderAddress,
      signatureType: "poly-gnosis-safe",
    });

    expect(order.signatureType).toBe("poly-gnosis-safe");
  });

  test("should use poly-proxy signatureType when specified", async () => {
    const mockClient = createMockClient();
    const mockMarketApi = createMockMarketApi();
    const api = new OrderApi(mockClient, mockMarketApi);

    const order = await api.createOrder({
      tokenId,
      price: 0.5,
      size: 10,
      side: "BUY",
      expiration: 0,
      taker: "anyone",
      signatureType: "poly-proxy",
    });

    expect(order.signatureType).toBe("poly-proxy");
  });

  test("should use consistent 6 decimal scaling for BUY order amounts", async () => {
    const mockClient = createMockClient();
    // tickSize "0.001" means 3 decimals for price
    const mockMarketApi = createMockMarketApi("0.001");
    const api = new OrderApi(mockClient, mockMarketApi);

    // price=0.545, size=1.83
    // shares = 1.83 (rounded to 2 decimals)
    // cost = 1.83 * 0.545 = 0.99735 (rounded to 5 decimals for tick=3 + size=2)
    // Both should use 10^6 scaling
    // sharesRaw = 1.83 * 10^6 = 1830000
    // costRaw = 0.99735 * 10^6 = 997350
    const order = await api.createOrder({
      tokenId,
      price: 0.545,
      size: 1.83,
      side: "BUY",
      expiration: 0,
      taker: "anyone",
    });

    // BUY: maker gives USDC (cost), taker gives shares
    expect(order.makerAmount).toBe("997350");
    expect(order.takerAmount).toBe("1830000");

    // Verify price calculation: makerAmount / takerAmount = 0.545...
    const impliedPrice =
      parseInt(order.makerAmount, 10) / parseInt(order.takerAmount, 10);
    expect(impliedPrice).toBeCloseTo(0.545, 3);
  });

  test("should use consistent 6 decimal scaling for SELL order amounts", async () => {
    const mockClient = createMockClient();
    const mockMarketApi = createMockMarketApi("0.001");
    const api = new OrderApi(mockClient, mockMarketApi);

    const order = await api.createOrder({
      tokenId,
      price: 0.545,
      size: 1.83,
      side: "SELL",
      expiration: 0,
      taker: "anyone",
    });

    // SELL: maker gives shares, taker gives USDC (cost)
    expect(order.makerAmount).toBe("1830000");
    expect(order.takerAmount).toBe("997350");

    // Verify price calculation: takerAmount / makerAmount = 0.545...
    const impliedPrice =
      parseInt(order.takerAmount, 10) / parseInt(order.makerAmount, 10);
    expect(impliedPrice).toBeCloseTo(0.545, 3);
  });

  test("should produce valid price (between 0 and 1) from order amounts", async () => {
    const mockClient = createMockClient();
    const mockMarketApi = createMockMarketApi("0.01");
    const api = new OrderApi(mockClient, mockMarketApi);

    // Test various prices to ensure they all produce valid implied prices
    const testCases = [
      { price: 0.1, size: 5.0 },
      { price: 0.5, size: 10.0 },
      { price: 0.99, size: 2.5 },
      { price: 0.01, size: 100.0 },
    ];

    for (const { price, size } of testCases) {
      const order = await api.createOrder({
        tokenId,
        price,
        size,
        side: "BUY",
        expiration: 0,
        taker: "anyone",
      });

      // For BUY orders: implied price = makerAmount / takerAmount
      const impliedPrice =
        parseInt(order.makerAmount, 10) / parseInt(order.takerAmount, 10);
      expect(impliedPrice).toBeGreaterThan(0);
      expect(impliedPrice).toBeLessThan(1);
      expect(impliedPrice).toBeCloseTo(price, 2);
    }
  });
});

describe("OrderApi postOrder behavior", () => {
  test("should convert signatureType to correct numeric value in payload", async () => {
    let capturedPayload: unknown;

    const mockClient = {
      credentials: { key: "test-key" },
      request: mock(async (opts: { options?: { body?: unknown } }) => {
        capturedPayload = opts.options?.body;
        return { success: true };
      }),
    } as unknown as BaseClient;

    const mockMarketApi = {} as MarketApi;
    const api = new OrderApi(mockClient, mockMarketApi);

    const signedOrder: SignedOrder = {
      salt: "123",
      maker: "0xMakerAddress1234567890123456789012345678",
      signer: "0xSignerAddress123456789012345678901234567",
      taker: "0x0000000000000000000000000000000000000000",
      tokenId: "token123",
      makerAmount: "1000000",
      takerAmount: "100",
      expiration: "0",
      nonce: "0",
      feeRateBps: "0",
      side: "BUY",
      signatureType: "poly-gnosis-safe",
      signature: "0xmocksignature",
    };

    await api.postOrder({ order: signedOrder, kind: "GTC" });

    expect(capturedPayload).toBeDefined();
    const payload = capturedPayload as { order: { signatureType: number } };
    expect(payload.order.signatureType).toBe(2); // poly-gnosis-safe = 2
  });

  test("should use signatureType 0 for eoa orders", async () => {
    let capturedPayload: unknown;

    const mockClient = {
      credentials: { key: "test-key" },
      request: mock(async (opts: { options?: { body?: unknown } }) => {
        capturedPayload = opts.options?.body;
        return { success: true };
      }),
    } as unknown as BaseClient;

    const mockMarketApi = {} as MarketApi;
    const api = new OrderApi(mockClient, mockMarketApi);

    const signedOrder: SignedOrder = {
      salt: "123",
      maker: "0xMakerAddress1234567890123456789012345678",
      signer: "0xSignerAddress123456789012345678901234567",
      taker: "0x0000000000000000000000000000000000000000",
      tokenId: "token123",
      makerAmount: "1000000",
      takerAmount: "100",
      expiration: "0",
      nonce: "0",
      feeRateBps: "0",
      side: "BUY",
      signatureType: "eoa",
      signature: "0xmocksignature",
    };

    await api.postOrder({ order: signedOrder, kind: "GTC" });

    expect(capturedPayload).toBeDefined();
    const payload = capturedPayload as { order: { signatureType: number } };
    expect(payload.order.signatureType).toBe(0); // eoa = 0
  });

  test("should use signatureType 1 for poly-proxy orders", async () => {
    let capturedPayload: unknown;

    const mockClient = {
      credentials: { key: "test-key" },
      request: mock(async (opts: { options?: { body?: unknown } }) => {
        capturedPayload = opts.options?.body;
        return { success: true };
      }),
    } as unknown as BaseClient;

    const mockMarketApi = {} as MarketApi;
    const api = new OrderApi(mockClient, mockMarketApi);

    const signedOrder: SignedOrder = {
      salt: "123",
      maker: "0xMakerAddress1234567890123456789012345678",
      signer: "0xSignerAddress123456789012345678901234567",
      taker: "0x0000000000000000000000000000000000000000",
      tokenId: "token123",
      makerAmount: "1000000",
      takerAmount: "100",
      expiration: "0",
      nonce: "0",
      feeRateBps: "0",
      side: "BUY",
      signatureType: "poly-proxy",
      signature: "0xmocksignature",
    };

    await api.postOrder({ order: signedOrder, kind: "GTC" });

    expect(capturedPayload).toBeDefined();
    const payload = capturedPayload as { order: { signatureType: number } };
    expect(payload.order.signatureType).toBe(1); // poly-proxy = 1
  });
});
