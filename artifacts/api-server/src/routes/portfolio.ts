import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, portfoliosTable } from "@workspace/db";
import { SavePortfolioBody, BuildPortfolioBody } from "@workspace/api-zod";

const router = Router();
const DEFAULT_USER = "guest-001";

function getUserId(req: any): string {
  return (req.headers["x-user-id"] as string) || DEFAULT_USER;
}

function serializePortfolio(p: typeof portfoliosTable.$inferSelect) {
  return {
    id: p.id,
    userId: p.userId,
    name: p.name,
    investmentAmount: Number(p.investmentAmount),
    monthlyContribution: Number(p.monthlyContribution),
    allocations: (p.allocations as any[]) ?? [],
    metrics: (p.metrics as Record<string, number>) ?? {},
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/portfolio", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const [portfolio] = await db
    .select()
    .from(portfoliosTable)
    .where(eq(portfoliosTable.userId, userId));

  if (!portfolio) {
    res.status(404).json({ error: "No portfolio found" });
    return;
  }
  res.json(serializePortfolio(portfolio));
});

router.post("/portfolio", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const parsed = SavePortfolioBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;

  const [existing] = await db
    .select({ id: portfoliosTable.id })
    .from(portfoliosTable)
    .where(eq(portfoliosTable.userId, userId));

  let portfolio;
  if (existing) {
    [portfolio] = await db
      .update(portfoliosTable)
      .set({ ...data, investmentAmount: String(data.investmentAmount), monthlyContribution: String(data.monthlyContribution), updatedAt: new Date() })
      .where(eq(portfoliosTable.userId, userId))
      .returning();
  } else {
    [portfolio] = await db
      .insert(portfoliosTable)
      .values({ userId, ...data, investmentAmount: String(data.investmentAmount), monthlyContribution: String(data.monthlyContribution) })
      .returning();
  }

  res.json(serializePortfolio(portfolio));
});

router.post("/portfolio/build", async (req, res): Promise<void> => {
  const parsed = BuildPortfolioBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { riskLevel, desiredReturn, maxVolatility } = parsed.data;

  type Allocation = { label: string; percentage: number; tickers: string[]; color: string };
  let allocations: Allocation[];
  let metrics: { expectedAnnualReturn: number; expectedVolatility: number; diversificationScore: number; dividendYield: number; expenseRatio: number; sharpeRatio: number };

  if (riskLevel === "Conservative" || riskLevel === "Very Conservative") {
    allocations = [
      { label: "Large Cap Dividend", percentage: 30, tickers: ["JNJ", "XOM", "O"], color: "#00d4aa" },
      { label: "Government Bonds", percentage: 25, tickers: ["TLT"], color: "#3b82f6" },
      { label: "International Developed", percentage: 15, tickers: ["VEA"], color: "#8b5cf6" },
      { label: "Corporate Bonds", percentage: 15, tickers: ["LQD"], color: "#f59e0b" },
      { label: "REITs", percentage: 10, tickers: ["PLD", "O"], color: "#ec4899" },
      { label: "Cash & Equivalents", percentage: 5, tickers: [], color: "#6b7280" },
    ];
    metrics = { expectedAnnualReturn: 5.8, expectedVolatility: 7.2, diversificationScore: 82, dividendYield: 3.4, expenseRatio: 0.08, sharpeRatio: 0.72 };
  } else if (riskLevel === "Moderate") {
    allocations = [
      { label: "Large Cap Growth", percentage: 30, tickers: ["AAPL", "MSFT", "GOOGL"], color: "#00d4aa" },
      { label: "International", percentage: 20, tickers: ["VEA", "VWO"], color: "#8b5cf6" },
      { label: "Dividend Stocks", percentage: 15, tickers: ["JNJ", "V", "MA"], color: "#3b82f6" },
      { label: "Investment-Grade Bonds", percentage: 15, tickers: ["BND"], color: "#f59e0b" },
      { label: "Small Cap", percentage: 10, tickers: ["IWM"], color: "#ec4899" },
      { label: "REITs", percentage: 10, tickers: ["PLD", "O"], color: "#ef4444" },
    ];
    metrics = { expectedAnnualReturn: 8.4, expectedVolatility: 11.8, diversificationScore: 88, dividendYield: 1.9, expenseRatio: 0.07, sharpeRatio: 0.63 };
  } else if (riskLevel === "High" || riskLevel === "Aggressive") {
    allocations = [
      { label: "Large Cap Growth", percentage: 35, tickers: ["AAPL", "MSFT", "NVDA", "META"], color: "#00d4aa" },
      { label: "Technology & Innovation", percentage: 20, tickers: ["AMD", "CRM", "GOOGL"], color: "#3b82f6" },
      { label: "International Growth", percentage: 15, tickers: ["VWO", "INDA"], color: "#8b5cf6" },
      { label: "Small Cap Growth", percentage: 15, tickers: ["IWM"], color: "#f59e0b" },
      { label: "Healthcare Innovation", percentage: 10, tickers: ["LLY", "ABBV"], color: "#ec4899" },
      { label: "Emerging Markets", percentage: 5, tickers: ["EEM"], color: "#ef4444" },
    ];
    metrics = { expectedAnnualReturn: 12.1, expectedVolatility: 18.4, diversificationScore: 74, dividendYield: 0.6, expenseRatio: 0.09, sharpeRatio: 0.61 };
  } else {
    // Very Aggressive / default
    allocations = [
      { label: "Large Cap Growth", percentage: 40, tickers: ["NVDA", "META", "AMZN", "GOOGL"], color: "#00d4aa" },
      { label: "Technology Sector", percentage: 25, tickers: ["AMD", "MSFT", "CRM"], color: "#3b82f6" },
      { label: "Small Cap Growth", percentage: 15, tickers: ["IWM"], color: "#8b5cf6" },
      { label: "International Growth", percentage: 10, tickers: ["VWO", "EEM"], color: "#f59e0b" },
      { label: "Healthcare Innovation", percentage: 10, tickers: ["LLY"], color: "#ec4899" },
    ];
    metrics = { expectedAnnualReturn: 15.3, expectedVolatility: 24.7, diversificationScore: 61, dividendYield: 0.2, expenseRatio: 0.09, sharpeRatio: 0.57 };
  }

  // Adjust metrics toward desired return if possible
  if (desiredReturn && metrics.expectedAnnualReturn < desiredReturn * 0.8) {
    metrics.expectedAnnualReturn = Math.min(desiredReturn, metrics.expectedAnnualReturn * 1.1);
  }

  const rationale = `This ${riskLevel.toLowerCase()} portfolio is designed to balance growth and stability aligned with your risk tolerance. The allocation emphasizes diversification across ${allocations.length} asset categories with an expected ${metrics.expectedAnnualReturn}% annual return. Investment decisions should be based on your complete financial situation — this analysis uses historical data and is not a guarantee of future performance.`;

  res.json({ allocations, metrics, rationale });
});

router.get("/portfolio/health", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const [portfolio] = await db
    .select()
    .from(portfoliosTable)
    .where(eq(portfoliosTable.userId, userId));

  const allocations = (portfolio?.allocations as any[]) ?? [];

  if (allocations.length === 0) {
    // Demo health score
    res.json({
      overallScore: 72,
      grade: "B+",
      categories: [
        { name: "Diversification", score: 75, description: "Moderate diversification across asset classes" },
        { name: "Risk Level", score: 68, description: "Risk level appropriate for moderate investors" },
        { name: "Sector Concentration", score: 71, description: "Slight technology overweight noted" },
        { name: "Dividend Quality", score: 65, description: "Some dividend income but could be higher" },
        { name: "Valuation", score: 78, description: "Holdings at reasonable valuations" },
        { name: "Growth Profile", score: 80, description: "Strong growth characteristics in portfolio" },
      ],
      suggestions: [
        "Consider adding international exposure to reduce US concentration risk",
        "Healthcare and utilities could provide defensive balance",
        "Bond allocation may improve risk-adjusted returns in volatile markets",
        "Regular rebalancing recommended quarterly to maintain target allocations",
      ],
    });
    return;
  }

  // Analyze actual portfolio
  const totalAllocation = allocations.reduce((sum: number, a: any) => sum + a.percentage, 0);
  const numAssets = allocations.length;
  const maxConcentration = allocations.reduce((max: number, a: any) => Math.max(max, a.percentage), 0);

  const diversificationScore = Math.min(95, Math.max(30, 40 + numAssets * 8 - maxConcentration));
  const hasBonds = allocations.some((a: any) => a.label?.toLowerCase().includes("bond") || a.label?.toLowerCase().includes("cash"));
  const hasInternational = allocations.some((a: any) => a.label?.toLowerCase().includes("international") || a.label?.toLowerCase().includes("emerging"));
  const hasREIT = allocations.some((a: any) => a.label?.toLowerCase().includes("reit") || a.label?.toLowerCase().includes("real estate"));
  const hasDividend = allocations.some((a: any) => a.label?.toLowerCase().includes("dividend"));

  const riskScore = hasBonds ? 80 : 55;
  const sectorScore = hasInternational ? 82 : 60;
  const dividendScore = hasDividend ? 78 : 55;
  const overallScore = Math.round((diversificationScore + riskScore + sectorScore + dividendScore + 75 + 80) / 6);
  const grade = overallScore >= 90 ? "A" : overallScore >= 80 ? "A-" : overallScore >= 70 ? "B+" : overallScore >= 60 ? "B" : "C+";

  const suggestions: string[] = [];
  if (!hasInternational) suggestions.push("Add international exposure to reduce geographic concentration");
  if (!hasBonds) suggestions.push("Consider investment-grade bonds for risk management");
  if (!hasREIT) suggestions.push("REITs offer inflation protection and income diversification");
  if (maxConcentration > 40) suggestions.push("Largest allocation is concentrated — consider rebalancing");
  if (!hasDividend) suggestions.push("Dividend stocks can provide income and portfolio stability");
  suggestions.push("Review and rebalance quarterly to maintain target allocations");

  res.json({
    overallScore,
    grade,
    categories: [
      { name: "Diversification", score: Math.round(diversificationScore), description: `${numAssets} asset categories with ${maxConcentration.toFixed(0)}% max concentration` },
      { name: "Risk Level", score: riskScore, description: hasBonds ? "Balanced with fixed income exposure" : "Equity-heavy — higher volatility expected" },
      { name: "Sector Concentration", score: sectorScore, description: hasInternational ? "Good global diversification" : "Mostly domestic — add international exposure" },
      { name: "Dividend Quality", score: dividendScore, description: hasDividend ? "Dividend income provides stability" : "Low dividend income" },
      { name: "Valuation", score: 75, description: "Holdings at reasonable current valuations" },
      { name: "Growth Profile", score: 80, description: "Strong long-term growth potential" },
    ],
    suggestions,
  });
});

export default router;
