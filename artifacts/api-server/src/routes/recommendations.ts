import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, investorProfilesTable } from "@workspace/db";
import { STOCK_UNIVERSE, ALL_TICKERS, getStockNews } from "../lib/stockData";
import { calculateScore, generatePros, generateCons, generateAiExplanation } from "../lib/scoring";

const router = Router();
const DEFAULT_USER = "guest-001";

function getUserId(req: any): string {
  return (req.headers["x-user-id"] as string) || DEFAULT_USER;
}

router.get("/recommendations", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const [profile] = await db
    .select()
    .from(investorProfilesTable)
    .where(eq(investorProfilesTable.userId, userId));

  const prefs = profile
    ? {
        goal: profile.goal,
        riskTolerance: profile.riskTolerance,
        dividendPreference: profile.dividendPreference,
        sectors: (profile.sectors as string[]) ?? [],
        esgPreference: profile.esgPreference,
      }
    : undefined;

  // Score all stocks
  const scored = ALL_TICKERS.map((ticker) => {
    const stock = STOCK_UNIVERSE[ticker];
    const { score, breakdown } = calculateScore(stock, prefs);
    const pros = generatePros(stock);
    const cons = generateCons(stock);
    const aiExplanation = generateAiExplanation(stock, score, prefs?.goal ?? "Long-Term Wealth", pros, cons);

    // Sector filtering — boost stocks in preferred sectors
    let sectorBoost = 0;
    if (prefs?.sectors && prefs.sectors.length > 0) {
      if (prefs.sectors.includes(stock.sector)) sectorBoost = 5;
    }

    // Dividend preference filtering
    if (prefs?.dividendPreference === "No Dividends" && stock.dividendYield) sectorBoost -= 3;
    if ((prefs?.dividendPreference === "High Yield" || prefs?.dividendPreference === "Maximum Yield") && !stock.dividendYield) sectorBoost -= 5;

    return {
      ticker: stock.ticker,
      company: stock.company,
      sector: stock.sector,
      score: Math.min(100, score + sectorBoost),
      price: stock.price,
      marketCap: stock.marketCap,
      peRatio: stock.peRatio,
      forwardPE: stock.forwardPE,
      dividendYield: stock.dividendYield,
      revenueGrowth: stock.revenueGrowth,
      epsGrowth: stock.epsGrowth,
      roe: stock.roe,
      operatingMargin: stock.operatingMargin,
      beta: stock.beta,
      scoreBreakdown: {
        valuation: breakdown.valuation,
        growth: breakdown.growth,
        profitability: breakdown.profitability,
        momentum: breakdown.momentum,
        dividendSafety: breakdown.dividendSafety,
      },
      aiExplanation,
      pros,
      cons,
      change1d: stock.change1d,
      change1dPct: stock.change1dPct,
    };
  });

  // Sort by score descending, return top 15
  const results = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  res.json(results);
});

router.get("/recommendations/summary", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const [profile] = await db
    .select()
    .from(investorProfilesTable)
    .where(eq(investorProfilesTable.userId, userId));

  const prefs = profile
    ? {
        goal: profile.goal,
        riskTolerance: profile.riskTolerance,
        dividendPreference: profile.dividendPreference,
        sectors: (profile.sectors as string[]) ?? [],
        esgPreference: profile.esgPreference,
      }
    : undefined;

  const scored = ALL_TICKERS.map((t) => {
    const s = STOCK_UNIVERSE[t];
    return { stock: s, ...calculateScore(s, prefs) };
  });

  const top10 = scored.sort((a, b) => b.score - a.score).slice(0, 10);
  const avgScore = Math.round(top10.reduce((sum, s) => sum + s.score, 0) / top10.length);
  const sectors = top10.map((s) => s.stock.sector);
  const sectorCounts = sectors.reduce((acc, s) => ({ ...acc, [s]: (acc[s] ?? 0) + 1 }), {} as Record<string, number>);
  const topSector = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Technology";
  const divStocks = top10.filter((s) => s.stock.dividendYield);
  const avgDividend = divStocks.length > 0
    ? divStocks.reduce((sum, s) => sum + (s.stock.dividendYield ?? 0), 0) / divStocks.length
    : 0;
  const avgBeta = top10.reduce((sum, s) => sum + s.stock.beta, 0) / top10.length;

  res.json({
    totalRecommendations: top10.length,
    avgScore,
    topSector,
    avgDividendYield: Math.round(avgDividend * 100) / 100,
    avgBeta: Math.round(avgBeta * 100) / 100,
    profileGoal: profile?.goal ?? "Not configured",
  });
});

export default router;
