import "dotenv/config";

import config from "./config";
import { placeOrder } from "./orders";
import api from "./api";

async function main() {
  const {
    data: { balance: balanceRaw },
  } = await api.portfolio.getBalance();
  const balance = balanceRaw / 100;
  const availableBalance = balance * config.reserveMult;

  console.log(
    `Current Balance: $${balance}. Using $${availableBalance} to place orders.`,
  );

  const countPerTicker = Math.floor(
    Math.floor(availableBalance) / config.tickers.length,
  );
  console.log(`Placing orders of x${countPerTicker} on each ticker...`);

  for (const ticker of config.tickers) {
    await placeOrder(ticker, countPerTicker, "no");
  }

  // await Promise.all(
  //   config.tickers.map((ticker) =>
  //     placeOrder(ticker, countPerTicker, "no", false),
  //   ),
  // );

  process.exit(0);
}

main();
