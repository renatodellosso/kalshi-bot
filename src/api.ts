import { MarketApi, OrdersApi, PortfolioApi } from "kalshi-typescript";
import config from "./config";

export default {
  portfolio: new PortfolioApi(config.api),
  markets: new MarketApi(config.api),
  orders: new OrdersApi(config.api),
};
