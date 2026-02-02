import "dotenv/config";

import config from "./config";
import { placeDoubleOrder } from "./orders";
import api from "./api";

async function main() {
  const { data: { balance: balanceRaw } } = await api.portfolio.getBalance();
  const balance = balanceRaw / 100;

  console.log(`Current Balance: $${balance}`);

  const countPerTicker = Math.floor(Math.floor(balance) / config.tickers.length / 2) * 2;
  console.log(`Placing double orders of x${countPerTicker} on each ticker...`);

  await Promise.all(
    config.tickers.map((ticker) => placeDoubleOrder(ticker, countPerTicker)),
  );

  process.exit(0);
}

main();
