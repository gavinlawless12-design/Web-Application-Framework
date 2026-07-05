import { Router } from "express";
import {
  getStock,
  searchStocksData,
  getPriceHistory,
  getRevenueHistory,
  getEpsHistory,
  getDividendHistory,
  getStockNews,
  STOCK_UNIVERSE,
} from "../lib/stockData";
import { calculateScore, generatePros, generateCons, generateAiExplanation } from "../lib/scoring";

const router = Router();

router.get("/stocks/search", async (req, res): Promise<void> => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  if (!q || q.trim().length === 0) {
    res.json([]);
    return;
  }
  const results = searchStocksData(q).map((s) => ({
    ticker: s.ticker,
    company: s.company,
    exchange: s.exchange,
    sector: s.sector,
    price: s.price,
    change1dPct: s.change1dPct,
  }));
  res.json(results);
});

router.get("/stocks/:ticker", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.ticker) ? req.params.ticker[0] : req.params.ticker;
  const ticker = raw?.toUpperCase();
  const stock = getStock(ticker);
  if (!stock) {
    res.status(404).json({ error: `Stock ${ticker} not found` });
    return;
  }

  const { score, breakdown } = calculateScore(stock);
  const pros = generatePros(stock);
  const cons = generateCons(stock);
  const aiSummary = generateAiExplanation(stock, score, "Long-Term Wealth", pros, cons) +
    ` ${stock.company} has demonstrated ${stock.revenueGrowth > 10 ? "strong" : "steady"} revenue growth of ${stock.revenueGrowth.toFixed(1)}% with ${stock.operatingMargin.toFixed(1)}% operating margins. Investors should conduct their own due diligence before making investment decisions.`;

  const competitors = stock.competitors
    .map((t) => {
      const c = STOCK_UNIVERSE[t];
      if (!c) return null;
      return { ticker: c.ticker, company: c.company, exchange: c.exchange, sector: c.sector, price: c.price, change1dPct: c.change1dPct };
    })
    .filter(Boolean);

  res.json({
    ticker: stock.ticker,
    company: stock.company,
    exchange: stock.exchange,
    sector: stock.sector,
    industry: stock.industry,
    description: stock.description,
    price: stock.price,
    change1d: stock.change1d,
    change1dPct: stock.change1dPct,
    marketCap: stock.marketCap,
    peRatio: stock.peRatio,
    forwardPE: stock.forwardPE,
    pbRatio: stock.pbRatio,
    psRatio: stock.psRatio,
    pegRatio: stock.pegRatio,
    dividendYield: stock.dividendYield,
    dividendGrowth5y: stock.dividendGrowth5y,
    revenueGrowth: stock.revenueGrowth,
    epsGrowth: stock.epsGrowth,
    roe: stock.roe,
    operatingMargin: stock.operatingMargin,
    freeCashFlow: stock.freeCashFlow,
    beta: stock.beta,
    volume: stock.volume,
    avgVolume: stock.avgVolume,
    week52High: stock.week52High,
    week52Low: stock.week52Low,
    analystRating: stock.analystRating,
    targetPrice: stock.targetPrice,
    institutionalOwnership: stock.institutionalOwnership,
    insiderOwnership: stock.insiderOwnership,
    priceHistory: getPriceHistory(ticker),
    revenueHistory: getRevenueHistory(ticker),
    epsHistory: getEpsHistory(ticker),
    dividendHistory: getDividendHistory(ticker),
    aiSummary,
    swot: stock.swot,
    competitors,
    news: getStockNews(ticker),
    score,
  });
});

router.get("/stocks/:ticker/score", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.ticker) ? req.params.ticker[0] : req.params.ticker;
  const ticker = raw?.toUpperCase();
  const stock = getStock(ticker);
  if (!stock) {
    res.status(404).json({ error: `Stock ${ticker} not found` });
    return;
  }
  const { score, breakdown } = calculateScore(stock);
  const pros = generatePros(stock);
  const cons = generateCons(stock);
  res.json({
    ticker: stock.ticker,
    score,
    breakdown,
    explanation: generateAiExplanation(stock, score, "Long-Term Wealth", pros, cons),
  });
});

export default router;
