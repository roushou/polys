import { createConnectedWallet, OrderBookClient } from "@dicedhq/polymarket";

const wallet = createConnectedWallet({
  privateKey: process.env.DICED_PRIVATE_KEY!,
  chain: "polygon",
});

const credentials = {
  key: process.env.DICED_POLYMARKET_API_KEY!,
  secret: process.env.DICED_POLYMARKET_SECRET!,
  passphrase: process.env.DICED_POLYMARKET_PASSPHRASE!,
};

const client = new OrderBookClient({
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
