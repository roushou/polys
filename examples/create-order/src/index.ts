import { createConnectedWallet, Polymarket } from "@dicedhq/polymarket";

const wallet = createConnectedWallet({
  privateKey: process.env.POLYS_PRIVATE_KEY!,
  chain: "polygon",
});

const credentials = {
  key: process.env.POLYS_POLYMARKET_API_KEY!,
  secret: process.env.POLYS_POLYMARKET_SECRET!,
  passphrase: process.env.POLYS_POLYMARKET_PASSPHRASE!,
};

const client = new Polymarket({
  wallet,
  credentials,
  attributor: {
    url: "http://127.0.0.1:8080/api/sign",
    token: "token1234",
  },
  debug: true,
});

const order = await client.order.postOrder({
  kind: "GTC",
  order: {
    signer: "0xC352DA08885e1f005dd717E624D3156b5E95Ad31",
    maker: "0xC352DA08885e1f005dd717E624D3156b5E95Ad31",
    taker: "0x0000000000000000000000000000000000000000",
    tokenId:
      "79264933844134965432036330400815583901906277460853083546372238875648926381572",
    nonce: "0",
    salt: "683805070075",
    feeRateBps: "0",
    expiration: "10000000000000",
    side: "BUY",
    signatureType: "eoa",
    makerAmount: "20000",
    takerAmount: "200",
    signature:
      "0xfff7418f968124f14ca5e4f98aad120775c987c78186b77503d6413512dc8cb8715d08d25e6f0ab618022c640ca4612ca36495f482615d9e0a1acf24fbe61b271b",
  },
});
console.log(order);

// const order = await client.order.createOrder({
//   price: 1,
//   side: "BUY",
//   size: 2,
//   tokenId:
//     "79264933844134965432036330400815583901906277460853083546372238875648926381572",
//   expiration: 1000000000,
//   taker: "public",
// });
// console.log(order);
