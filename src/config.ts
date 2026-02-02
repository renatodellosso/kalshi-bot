import { Configuration } from "kalshi-typescript";

export default {
  api: new Configuration({
    apiKey: process.env.API_KEY,
    privateKeyPath: "private.key",
    basePath: process.env.API_URL,
  }),
  tickers: [
    "KXPRESPERSON-28-JVAN",
    // "KXPRESPERSON-28-GNEWS",
    // "KXPRESPERSON-28-MRUB",
    // "KXPRESPERSON-28-AOCA"
  ],
  targetSpread: 0.01,
  reserveMult: 0.5,
};
