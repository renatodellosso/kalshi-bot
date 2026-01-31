import "dotenv/config";

import config from "./config";
import { placeOrder } from "./orders";

async function main() {
  await placeOrder(config.ticker, 5);

  process.exit(0);
}

main();
