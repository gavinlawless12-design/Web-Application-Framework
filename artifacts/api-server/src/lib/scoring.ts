// PortfolioPilot Scoring Engine — scores 0-100 based on financial fundamentals

import type { StockData } from "./stockData";

export interface InvestorPreferences {
  goal: string;
  riskTolerance: string;
  dividendPreference: string;
  sectors: string[];
  esgPreference: boolean;
}

export interface ScoreBreakdown {
  valuation: number;
  growth: number;
  profitability: number;
  momentum: number;
  dividendSafety: number;
  debtLevel: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function scoreValuation(s: StockData): number {
  let score = 50;
  if (s.peRatio !== null) {
    if (s.peRatio < 10) score += 25;
    else if (s.peRatio < 15) score += 18;
    else if (s.peRatio < 20) score += 10;
    else if (s.peRatio < 30) score += 2;
    else if (s.peRatio < 40) score -= 8;
    else score -= 18;
  }
  if (s.pegRatio !== null) {
    if (s.pegRatio < 1) score += 14;
    else if (s.pegRatio < 1.5) score += 8;
    else if (s.pegRatio < 2) score += 4;
    else if (s.pegRatio > 3) score -= 8;
  }
  if (s.psRatio !== null) {
    if (s.psRatio < 1) score += 10;
    else if (s.psRatio < 3) score += 5;
    else if (s.psRatio > 15) score -= 8;
  }
  return clamp(score, 0, 100);
}

function scoreGrowth(s: StockData): number {
  let score = 50;
  if (s.revenueGrowth > 50) score += 30;
  else if (s.revenueGrowth > 25) score += 22;
  else if (s.revenueGrowth > 15) score += 14;
  else if (s.revenueGrowth > 8) score += 8;
  else if (s.revenueGrowth > 2) score += 3;
  else if (s.revenueGrowth < 0) score -= 15;
  if (s.epsGrowth > 80) score += 20;
  else if (s.epsGrowth > 30) score += 12;
  else if (s.epsGrowth > 10) score += 6;
  else if (s.epsGrowth < -10) score -= 12;
  return clamp(score, 0, 100);
}

function scoreProfitability(s: StockData): number {
  let score = 50;
  if (s.operatingMargin > 50) score += 30;
  else if (s.operatingMargin > 30) score += 22;
  else if (s.operatingMargin > 20) score += 14;
  else if (s.operatingMargin > 10) score += 6;
  else if (s.operatingMargin < 0) score -= 20;
  const roe = Math.min(s.roe, 200); // cap extreme values
  if (roe > 50) score += 18;
  else if (roe > 25) score += 10;
  else if (roe > 12) score += 4;
  else if (roe < 0) score -= 8;
  return clamp(score, 0, 100);
}

function scoreMomentum(s: StockData): number {
  let score = 50;
  if (s.change1dPct > 3) score += 12;
  else if (s.change1dPct > 1) score += 6;
  else if (s.change1dPct > 0) score += 2;
  else if (s.change1dPct < -3) score -= 12;
  else if (s.change1dPct < -1) score -= 6;
  const range = s.week52High - s.week52Low;
  if (range > 0) {
    const pct = (s.price - s.week52Low) / range;
    if (pct > 0.85) score += 10;
    else if (pct > 0.65) score += 5;
    else if (pct < 0.25) score -= 8;
  }
  return clamp(score, 0, 100);
}

function scoreDividendSafety(s: StockData): number {
  if (!s.dividendYield) return 45;
  let score = 50;
  if (s.dividendYield > 7) score += 5; // high yield may indicate risk
  else if (s.dividendYield > 4) score += 18;
  else if (s.dividendYield > 2) score += 12;
  else if (s.dividendYield > 0.5) score += 6;
  if (s.dividendGrowth5y) {
    if (s.dividendGrowth5y > 10) score += 20;
    else if (s.dividendGrowth5y > 5) score += 12;
    else if (s.dividendGrowth5y > 0) score += 5;
  }
  if (s.operatingMargin > 20) score += 8;
  return clamp(score, 0, 100);
}

function scoreDebtProxy(s: StockData): number {
  let score = 65;
  if (s.analystRating === "Strong Buy") score += 18;
  else if (s.analystRating === "Buy") score += 10;
  else if (s.analystRating === "Hold") score -= 5;
  else if (s.analystRating === "Sell") score -= 20;
  if (s.institutionalOwnership > 85) score += 8;
  else if (s.institutionalOwnership > 70) score += 4;
  return clamp(score, 0, 100);
}

type Weights = { valuation: number; growth: number; profitability: number; momentum: number; dividendSafety: number; debtLevel: number };

function normalizeWeights(w: Weights): Weights {
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  if (total === 0) return w;
  return Object.fromEntries(Object.entries(w).map(([k, v]) => [k, v / total])) as Weights;
}

export function calculateScore(stock: StockData, prefs?: InvestorPreferences): { score: number; breakdown: ScoreBreakdown } {
  const breakdown: ScoreBreakdown = {
    valuation: scoreValuation(stock),
    growth: scoreGrowth(stock),
    profitability: scoreProfitability(stock),
    momentum: scoreMomentum(stock),
    dividendSafety: scoreDividendSafety(stock),
    debtLevel: scoreDebtProxy(stock),
  };

  let w: Weights = { valuation: 0.2, growth: 0.2, profitability: 0.2, momentum: 0.1, dividendSafety: 0.15, debtLevel: 0.15 };

  if (prefs) {
    const g = prefs.goal;
    if (g === "Income" || g === "Dividend Growth") {
      w = { valuation: 0.12, growth: 0.1, profitability: 0.18, momentum: 0.05, dividendSafety: 0.4, debtLevel: 0.15 };
    } else if (g === "Growth" || g === "Aggressive Growth") {
      w = { valuation: 0.1, growth: 0.38, profitability: 0.25, momentum: 0.15, dividendSafety: 0.04, debtLevel: 0.08 };
    } else if (g === "Value Investing") {
      w = { valuation: 0.38, growth: 0.12, profitability: 0.18, momentum: 0.05, dividendSafety: 0.12, debtLevel: 0.15 };
    } else if (g === "Retirement" || g === "Long-Term Wealth") {
      w = { valuation: 0.2, growth: 0.15, profitability: 0.2, momentum: 0.05, dividendSafety: 0.25, debtLevel: 0.15 };
    }
    const rt = prefs.riskTolerance;
    if (rt === "Very Conservative" || rt === "Conservative") {
      w.dividendSafety += 0.08;
      w.momentum = Math.max(w.momentum - 0.05, 0.02);
    } else if (rt === "Very High") {
      w.growth += 0.06;
      w.momentum += 0.04;
      w.dividendSafety = Math.max(w.dividendSafety - 0.05, 0.02);
    }
    w = normalizeWeights(w);
  }

  const score = clamp(
    Math.round(
      breakdown.valuation * w.valuation +
        breakdown.growth * w.growth +
        breakdown.profitability * w.profitability +
        breakdown.momentum * w.momentum +
        breakdown.dividendSafety * w.dividendSafety +
        breakdown.debtLevel * w.debtLevel
    ),
    0,
    100
  );

  return { score, breakdown };
}

export function generatePros(s: StockData): string[] {
  const pros: string[] = [];
  if (s.revenueGrowth > 30) pros.push(`Exceptional revenue growth of ${s.revenueGrowth.toFixed(1)}% YoY`);
  else if (s.revenueGrowth > 10) pros.push(`Strong revenue growth of ${s.revenueGrowth.toFixed(1)}% YoY`);
  if (s.operatingMargin > 40) pros.push(`Industry-leading operating margin of ${s.operatingMargin.toFixed(1)}%`);
  else if (s.operatingMargin > 20) pros.push(`Above-average operating margin of ${s.operatingMargin.toFixed(1)}%`);
  if (s.dividendYield && s.dividendYield > 2) pros.push(`Attractive dividend yield of ${s.dividendYield.toFixed(2)}%`);
  if (s.dividendGrowth5y && s.dividendGrowth5y > 7) pros.push(`${s.dividendGrowth5y.toFixed(1)}% annual dividend growth over 5 years`);
  if (s.analystRating === "Strong Buy") pros.push("Strong Buy consensus from Wall Street analysts");
  else if (s.analystRating === "Buy") pros.push("Buy consensus from analyst community");
  if (s.roe > 30) pros.push(`High return on equity of ${Math.min(s.roe, 200).toFixed(1)}%`);
  if (s.institutionalOwnership > 80) pros.push(`High institutional confidence at ${s.institutionalOwnership.toFixed(1)}% ownership`);
  if (s.epsGrowth > 40) pros.push(`Strong EPS growth of ${s.epsGrowth.toFixed(0)}%`);
  if (s.targetPrice && s.targetPrice > s.price * 1.1) {
    const upside = (((s.targetPrice - s.price) / s.price) * 100).toFixed(0);
    pros.push(`${upside}% analyst upside to price target of $${s.targetPrice}`);
  }
  return pros.slice(0, 4);
}

export function generateCons(s: StockData): string[] {
  const cons: string[] = [];
  if (s.peRatio && s.peRatio > 40) cons.push(`High valuation at ${s.peRatio.toFixed(1)}x trailing earnings`);
  else if (s.peRatio && s.peRatio > 25) cons.push("Premium valuation requires continued strong execution");
  if (s.beta > 1.5) cons.push(`High price volatility — beta of ${s.beta.toFixed(2)}`);
  if (s.revenueGrowth < 5 && s.revenueGrowth >= 0) cons.push(`Modest revenue growth of ${s.revenueGrowth.toFixed(1)}%`);
  if (s.revenueGrowth < 0) cons.push(`Declining revenue of ${s.revenueGrowth.toFixed(1)}%`);
  if (s.epsGrowth < -5) cons.push("Declining earnings per share");
  if (!s.dividendYield) cons.push("No dividend income for income-focused investors");
  if (s.analystRating === "Hold") cons.push("Neutral analyst sentiment with limited consensus upside");
  if (s.psRatio && s.psRatio > 15) cons.push(`Rich price-to-sales of ${s.psRatio.toFixed(1)}x`);
  return cons.slice(0, 3);
}

export function generateAiExplanation(stock: StockData, score: number, userGoal: string, pros: string[], cons: string[]): string {
  const tier = score >= 80 ? "top-tier" : score >= 65 ? "strong" : score >= 50 ? "moderate" : "below-average";
  const goalMap: Record<string, string> = {
    Growth: "growth-oriented",
    "Aggressive Growth": "high-growth",
    Income: "income-focused",
    "Dividend Growth": "dividend-growth",
    "Value Investing": "value-oriented",
    "Long-Term Wealth": "long-term wealth building",
    Retirement: "retirement income",
    Balanced: "balanced",
  };
  const goalLabel = goalMap[userGoal] || "long-term";
  const prosText = pros.slice(0, 2).join(" and ").toLowerCase();
  return `${stock.company} earns a ${tier} PortfolioPilot Score of ${score}/100, reflecting ${prosText}${cons.length > 0 ? `, though investors should note ${cons[0].toLowerCase()}` : ""}. For a ${goalLabel} strategy, this stock ${score >= 65 ? "aligns well with your objectives given its financial profile" : "may require careful consideration relative to your risk tolerance and goals"}. Past performance does not guarantee future results — this analysis is based on current financial fundamentals only.`;
}
