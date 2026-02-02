import { Configuration } from "kalshi-typescript";

export default {
  api: new Configuration({
    apiKey: process.env.API_KEY,
    privateKeyPath: "private.key",
    basePath: process.env.API_URL,
  }),
  tickers: ["KXPRESPERSON-28-JVAN", "KXPRESPERSON-28-GNEWS"],
  targetSpread: 0.01,
};
