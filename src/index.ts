import "dotenv/config";

import { Configuration, PortfolioApi } from "kalshi-typescript";

async function main() {
  // Configure the SDK
  const config = new Configuration({
    apiKey: process.env.API_KEY,
    privateKeyPath: "private.key",
    basePath: process.env.API_URL,
  });

  // Create API instance
  const portfolioApi = new PortfolioApi(config);

  // Make API calls
  const balance = await portfolioApi.getBalance();
  console.log(`Balance: $${(balance.data.balance || 0) / 100}`);

  process.exit(0);
}

main().catch((error) => {
  console.error("Error occurred:", error);
});
