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
  debug: true,
});

const order = await client.order.createOrder({
  price: 1,
  side: "BUY",
  size: 2,
  tokenId:
    "79264933844134965432036330400815583901906277460853083546372238875648926381572",
  expiration: 1000000000,
  taker: "public",
});
console.log(order);
