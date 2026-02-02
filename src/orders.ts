import { GetMarketResponse, Order } from "kalshi-typescript";
import api from "./api";
import config from "./config";
import { confirm } from "./input";

/**
 * @deprecated
 */
export async function placeDoubleOrder(market: string, count: number) {
  if (count % 2 !== 0) {
    throw new Error("Count must be an even number for double orders.");
  }

  const [yesOrders, noOrders] = await Promise.all([
    placeOrder(market, count / 2, "yes", false),
    placeOrder(market, count / 2, "no", false),
  ]);

  return { yesOrders, noOrders };
}

export async function placeOrder(
  market: string,
  count: number,
  requireConfirmation = true,
) {
  const { data } = await api.markets.getMarket(market);

  const buyPrice = getBuyPrice(data);
  const sellPrice = getSellPrice(data);
  const estimatedProfit = estimateProfit(buyPrice, sellPrice, count);

  if (estimatedProfit < 0.01) {
    console.log(
      `Skipping order on ${market} for ${count} contracts: Estimated profit is $${estimatedProfit.toFixed(
        2,
      )}`,
    );
    return;
  }

  if (requireConfirmation) {
    console.log(
      `[CONFIRM y/N] Place orders on ${market} for ${count} contracts: Buy at $${buyPrice.toFixed(
        4,
      )}, Sell at $${sellPrice.toFixed(4)} | Fees: $${(calcFees(buyPrice, count) + calcFees(sellPrice, count)).toFixed(2)} | Estimated Profit: $${estimatedProfit.toFixed(2)}`,
    );

    if (!(await confirm())) {
      console.log("Order cancelled.");
      return;
    }
  }

  const [buyRes, sellRes] = await Promise.all([
    api.orders.createOrder({
      ticker: market,
      type: "limit",
      side: "no",
      count,
      no_price_dollars: (1 - buyPrice).toFixed(4),
      action: "buy",
      self_trade_prevention_type: "maker",
    }),
    api.orders.createOrder({
      ticker: market,
      type: "limit",
      side: "yes",
      count,
      yes_price_dollars: sellPrice.toFixed(4),
      action: "buy",
      self_trade_prevention_type: "maker",
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
