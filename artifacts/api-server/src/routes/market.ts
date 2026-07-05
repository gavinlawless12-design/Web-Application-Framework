import { Router } from "express";
import { STOCK_UNIVERSE, getStockNews } from "../lib/stockData";

const router = Router();

// Deterministic values seeded on the day to avoid flickering
function getDaySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededRand(seed: number, offset: number): number {
  const x = Math.sin(seed + offset) * 10000;
  return x - Math.floor(x);
}

router.get("/market/overview", async (req, res): Promise<void> => {
  const seed = getDaySeed();
  const fearGreed = Math.round(38 + seededRand(seed, 1) * 42); // 38-80

  const fearGreedLabel =
    fearGreed >= 75 ? "Extreme Greed" :
    fearGreed >= 60 ? "Greed" :
    fearGreed >= 45 ? "Neutral" :
    fearGreed >= 30 ? "Fear" : "Extreme Fear";

  const indexes = [
    {
      name: "S&P 500", ticker: "SPX",
      value: 5892.31 + seededRand(seed, 2) * 80 - 40,
      change1d: (seededRand(seed, 3) - 0.48) * 40,
      change1dPct: (seededRand(seed, 4) - 0.48) * 1.2,
    },
    {
      name: "NASDAQ", ticker: "IXIC",
      value: 19423.5 + seededRand(seed, 5) * 300 - 150,
      change1d: (seededRand(seed, 6) - 0.47) * 120,
      change1dPct: (seededRand(seed, 7) - 0.47) * 1.4,
    },
    {
      name: "Dow Jones", ticker: "DJI",
      value: 43145.8 + seededRand(seed, 8) * 200 - 100,
      change1d: (seededRand(seed, 9) - 0.48) * 150,
      change1dPct: (seededRand(seed, 10) - 0.48) * 0.8,
    },
    {
      name: "Russell 2000", ticker: "RUT",
      value: 2187.4 + seededRand(seed, 11) * 30 - 15,
      change1d: (seededRand(seed, 12) - 0.49) * 20,
      change1dPct: (seededRand(seed, 13) - 0.49) * 1.5,
    },
    {
      name: "VIX", ticker: "VIX",
      value: 14.2 + seededRand(seed, 14) * 8,
      change1d: (seededRand(seed, 15) - 0.5) * 1.5,
      change1dPct: (seededRand(seed, 16) - 0.5) * 8,
    },
  ].map((idx) => ({
    name: idx.name,
    ticker: idx.ticker,
    value: Math.round(idx.value * 100) / 100,
    change1d: Math.round(idx.change1d * 100) / 100,
    change1dPct: Math.round(idx.change1dPct * 100) / 100,
  }));

  res.json({
    fearGreedIndex: fearGreed,
    fearGreedLabel,
    indexes,
    lastUpdated: new Date().toISOString(),
  });
});

router.get("/market/trending", async (req, res): Promise<void> => {
  const all = Object.values(STOCK_UNIVERSE);

  const gainers = [...all].sort((a, b) => b.change1dPct - a.change1dPct).slice(0, 5);
  const losers = [...all].sort((a, b) => a.change1dPct - b.change1dPct).slice(0, 5);

  // Trending = high volume + high absolute change
  const trending = [...all]
    .sort((a, b) => Math.abs(b.change1dPct) - Math.abs(a.change1dPct))
    .slice(0, 8);

  const toResult = (s: (typeof STOCK_UNIVERSE)[string]) => ({
    ticker: s.ticker,
    company: s.company,
    exchange: s.exchange,
    sector: s.sector,
    price: s.price,
    change1dPct: s.change1dPct,
  });

  res.json({
    trending: trending.map(toResult),
    topGainers: gainers.map(toResult),
    topLosers: losers.map(toResult),
  });
});

router.get("/market/news", async (req, res): Promise<void> => {
  const tickers = ["NVDA", "AAPL", "MSFT", "META", "AMZN", "LLY", "JPM"];
  const allNews = tickers.flatMap((t) => getStockNews(t)).slice(0, 15);

  // Market-wide headlines
  const marketHeadlines = [
    {
      id: "market-1",
      title: "Federal Reserve Signals Cautious Approach to Rate Cuts",
      summary: "Fed officials indicated a measured pace for potential interest rate reductions, citing persistent services inflation and strong labor market data in their latest communications.",
      source: "Bloomberg",
      url: "https://example.com/fed-rates",
      publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      sentiment: "neutral",
      tickers: ["SPX", "TLT"],
    },
    {
      id: "market-2",
      title: "AI Chip Demand Drives Semiconductor Sector Outperformance",
      summary: "The semiconductor sector continues to outperform broader markets as hyperscaler capital expenditure guidance remains elevated, with data center GPU allocations expanding quarter-over-quarter.",
      source: "Financial Times",
      url: "https://example.com/semis",
      publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
      sentiment: "positive",
      tickers: ["NVDA", "AMD", "INTC"],
    },
    {
      id: "market-3",
      title: "Healthcare Sector Leads as GLP-1 Momentum Continues",
      summary: "Healthcare stocks outperformed broader markets this week as Eli Lilly and Novo Nordisk reported continued prescription growth for their GLP-1 weight loss and diabetes medications.",
      source: "Reuters",
      url: "https://example.com/glp1",
      publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      sentiment: "positive",
      tickers: ["LLY", "NVO", "UNH"],
    },
  ];

  res.json([...marketHeadlines, ...allNews].slice(0, 15));
});

export default router;
