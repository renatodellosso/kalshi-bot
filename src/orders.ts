import { GetMarketResponse, Order } from "kalshi-typescript";
import api from "./api";
import config from "./config";

export async function placeOrder(market: string, count: number) {
  const { data } = await api.markets.getMarket(market);

  const buyPrice = getBuyPrice(data);
  const sellPrice = getSellPrice(data);
  const estimatedProfit = estimateProfit(buyPrice, sellPrice, count);

  console.log(
    `Placing orders on ${market} for ${count} contracts: Buy at $${buyPrice.toFixed(
      4,
    )}, Sell at $${sellPrice.toFixed(4)} | Estimated Profit: $${estimatedProfit.toFixed(2)}`,
  );

  const [buyRes, sellRes] = await Promise.all([
    api.orders.createOrder({
      ticker: market,
      type: "limit",
      side: "yes",
      count,
      yes_price_dollars: buyPrice.toFixed(4),
      action: "buy",
    }),
    api.orders.createOrder({
      ticker: market,
      type: "limit",
      side: "yes",
      count,
      yes_price_dollars: sellPrice.toFixed(4),
      action: "sell",
    }),
  ]);

  const buyOrder = buyRes.data.order;
  const sellOrder = sellRes.data.order;

  logOrder(buyOrder);
  logOrder(sellOrder);

  return { buyOrder, sellOrder };
}

function logOrder(order: Order) {
  console.log(
    `Placed ${order.type} ${order.action} ${order.side} x${order.initial_count} on ${order.ticker} at $${order.side === "yes" ? order.yes_price_dollars : order.no_price_dollars}`,
  );
}

function calcFees(price: number, count: number) {
  const feeRate = 0.0175; // 1.75% fee per side (maker/resting order). 7% for taker orders.
  return Math.ceil(feeRate * count * price * (1 - price) * 100) / 100;
}

function estimateProfit(buyPrice: number, sellPrice: number, count: number) {
  const fees = calcFees(buyPrice, count) + calcFees(sellPrice, count);
  return count * (sellPrice - buyPrice) - fees;
}

function getBuyPrice(market: GetMarketResponse): number {
  const price =
    Number(market.market.last_price_dollars) - config.targetSpread / 2;
  return Math.floor(price * 100) / 100;
}

function getSellPrice(market: GetMarketResponse): number {
  const price =
    Number(market.market.last_price_dollars) + config.targetSpread / 2;
  return Math.ceil(price * 100) / 100;
}
