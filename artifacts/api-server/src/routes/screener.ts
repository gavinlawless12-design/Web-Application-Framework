import { Router } from "express";
import { RunScreenerBody } from "@workspace/api-zod";
import { STOCK_UNIVERSE } from "../lib/stockData";
import { calculateScore } from "../lib/scoring";

const router = Router();

const PRESETS = [
  {
    id: "growth",
    name: "Growth Screener",
    description: "High-growth companies with strong revenue and EPS expansion",
    filters: { minRevenueGrowth: 15, minROE: 15, maxBeta: 2.5, sectors: null, minScore: null, maxScore: null, minPE: null, maxPE: null, minDividendYield: null, maxDividendYield: null, minOperatingMargin: null, marketCapSize: null },
  },
  {
    id: "value",
    name: "Value Screener",
    description: "Undervalued stocks with low P/E and attractive fundamentals",
    filters: { maxPE: 18, minROE: 10, minDividendYield: 1, minRevenueGrowth: null, maxBeta: null, sectors: null, minScore: null, maxScore: null, minPE: null, maxDividendYield: null, minOperatingMargin: null, marketCapSize: null },
  },
  {
    id: "dividend",
    name: "Dividend Screener",
    description: "High-quality dividend payers with strong growth history",
    filters: { minDividendYield: 2.5, minOperatingMargin: 15, minROE: 10, minRevenueGrowth: null, maxBeta: null, sectors: null, minScore: null, maxScore: null, minPE: null, maxPE: null, maxDividendYield: null, marketCapSize: null },
  },
  {
    id: "quality",
    name: "High Quality Screener",
    description: "Exceptional profitability and balance sheet strength",
    filters: { minROE: 20, minOperatingMargin: 20, minRevenueGrowth: 5, maxBeta: null, sectors: null, minScore: null, maxScore: null, minPE: null, maxPE: null, minDividendYield: null, maxDividendYield: null, marketCapSize: null },
  },
  {
    id: "momentum",
    name: "Momentum Screener",
    description: "Stocks with strong price and fundamental momentum",
    filters: { minScore: 70, minRevenueGrowth: 10, maxBeta: null, sectors: null, maxScore: null, minPE: null, maxPE: null, minDividendYield: null, maxDividendYield: null, minROE: null, minOperatingMargin: null, marketCapSize: null },
  },
  {
    id: "smallcap",
    name: "Small Cap Screener",
    description: "Small and mid-cap opportunities with high growth potential",
    filters: { marketCapSize: "small", minRevenueGrowth: 8, maxBeta: null, sectors: null, minScore: null, maxScore: null, minPE: null, maxPE: null, minDividendYield: null, maxDividendYield: null, minROE: null, minOperatingMargin: null },
  },
  {
    id: "ai",
    name: "AI Screener",
    description: "Top PortfolioPilot Score stocks across all categories",
    filters: { minScore: 75, minRevenueGrowth: null, maxBeta: null, sectors: null, maxScore: null, minPE: null, maxPE: null, minDividendYield: null, maxDividendYield: null, minROE: null, minOperatingMargin: null, marketCapSize: null },
  },
];

router.get("/screener/presets", async (_req, res): Promise<void> => {
  res.json(PRESETS);
});

router.post("/screener", async (req, res): Promise<void> => {
  const parsed = RunScreenerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let filters = parsed.data.filters;

  // Apply preset if specified
  if (parsed.data.preset) {
    const preset = PRESETS.find((p) => p.id === parsed.data.preset);
    if (preset) {
      filters = { ...preset.filters, ...filters };
    }
  }

  const limit = parsed.data.limit ?? 20;
  const sortBy = parsed.data.sortBy ?? "score";
  const sortOrder = parsed.data.sortOrder ?? "desc";

  const results = Object.values(STOCK_UNIVERSE)
    .map((stock) => {
      const { score } = calculateScore(stock);
      return { stock, score };
    })
    .filter(({ stock, score }) => {
      if (filters.minScore !== null && filters.minScore !== undefined && score < filters.minScore) return false;
      if (filters.maxScore !== null && filters.maxScore !== undefined && score > filters.maxScore) return false;
      if (filters.minPE !== null && filters.minPE !== undefined) {
        if (!stock.peRatio || stock.peRatio < filters.minPE) return false;
      }
      if (filters.maxPE !== null && filters.maxPE !== undefined) {
        if (!stock.peRatio || stock.peRatio > filters.maxPE) return false;
      }
      if (filters.minDividendYield !== null && filters.minDividendYield !== undefined) {
        if (!stock.dividendYield || stock.dividendYield < filters.minDividendYield) return false;
      }
      if (filters.maxDividendYield !== null && filters.maxDividendYield !== undefined) {
        if (stock.dividendYield && stock.dividendYield > filters.maxDividendYield) return false;
      }
      if (filters.minRevenueGrowth !== null && filters.minRevenueGrowth !== undefined) {
        if (stock.revenueGrowth < filters.minRevenueGrowth) return false;
      }
      if (filters.maxBeta !== null && filters.maxBeta !== undefined) {
        if (stock.beta > filters.maxBeta) return false;
      }
      if (filters.minROE !== null && filters.minROE !== undefined) {
        if (stock.roe < filters.minROE) return false;
      }
      if (filters.minOperatingMargin !== null && filters.minOperatingMargin !== undefined) {
        if (stock.operatingMargin < filters.minOperatingMargin) return false;
      }
      if (filters.sectors && filters.sectors.length > 0) {
        if (!filters.sectors.includes(stock.sector)) return false;
      }
      if (filters.marketCapSize === "small") {
        const capStr = stock.marketCap;
        const val = parseFloat(capStr);
        if (capStr.includes("T") || (capStr.includes("B") && val > 50)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortBy === "score") { aVal = a.score; bVal = b.score; }
      else if (sortBy === "revenueGrowth") { aVal = a.stock.revenueGrowth; bVal = b.stock.revenueGrowth; }
      else if (sortBy === "dividendYield") { aVal = a.stock.dividendYield ?? 0; bVal = b.stock.dividendYield ?? 0; }
      else if (sortBy === "peRatio") { aVal = a.stock.peRatio ?? 999; bVal = b.stock.peRatio ?? 999; }
      else if (sortBy === "beta") { aVal = a.stock.beta; bVal = b.stock.beta; }
      else { aVal = a.score; bVal = b.score; }
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    })
    .slice(0, limit)
    .map(({ stock, score }) => ({
      ticker: stock.ticker,
      company: stock.company,
      sector: stock.sector,
      score,
      price: stock.price,
      change1dPct: stock.change1dPct,
      peRatio: stock.peRatio,
      dividendYield: stock.dividendYield,
      revenueGrowth: stock.revenueGrowth,
      roe: stock.roe,
      beta: stock.beta,
      marketCap: stock.marketCap,
    }));

  res.json(results);
});

export default router;
