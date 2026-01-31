import { Configuration } from "kalshi-typescript";

export default {
  api: new Configuration({
    apiKey: process.env.API_KEY,
    privateKeyPath: "private.key",
    basePath: process.env.API_URL,
  }),
  ticker: "KXPRESPERSON-28-JVAN",
  targetSpread: 0.01,
};
