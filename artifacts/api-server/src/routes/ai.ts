import { Router } from "express";
import { randomUUID } from "crypto";
import { eq, and, desc } from "drizzle-orm";
import { db, chatMessagesTable } from "@workspace/db";
import { AiChatBody } from "@workspace/api-zod";
import { askAI } from "../lib/openai";
import { getStock, STOCK_UNIVERSE } from "../lib/stockData";
import { calculateScore, generatePros, generateCons } from "../lib/scoring";

const router = Router();
const DEFAULT_USER = "guest-001";

function getUserId(req: any): string {
  return (req.headers["x-user-id"] as string) || DEFAULT_USER;
}

function buildFallbackResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  // Stock-specific analysis
  const tickers = Object.keys(STOCK_UNIVERSE).filter((t) => lowerMsg.includes(t.toLowerCase()));
  if (tickers.length === 2) {
    const [t1, t2] = tickers;
    const s1 = STOCK_UNIVERSE[t1];
    const s2 = STOCK_UNIVERSE[t2];
    const sc1 = calculateScore(s1).score;
    const sc2 = calculateScore(s2).score;
    return `Comparing ${s1.company} (${t1}) vs ${s2.company} (${t2}): ${t1} scores ${sc1}/100 with ${s1.revenueGrowth.toFixed(1)}% revenue growth and ${s1.operatingMargin.toFixed(1)}% operating margin. ${t2} scores ${sc2}/100 with ${s2.revenueGrowth.toFixed(1)}% revenue growth and ${s2.operatingMargin.toFixed(1)}% operating margin. ${sc1 > sc2 ? t1 : t2} ranks higher based on current financial fundamentals. Past performance does not guarantee future results — always conduct your own due diligence before investing.`;
  }
  if (tickers.length === 1) {
    const ticker = tickers[0];
    const stock = STOCK_UNIVERSE[ticker];
    const { score, breakdown } = calculateScore(stock);
    const pros = generatePros(stock);
    const cons = generateCons(stock);
    if (lowerMsg.includes("risk") || lowerMsg.includes("danger") || lowerMsg.includes("concern")) {
      return `The key risks for ${stock.company} (${ticker}) include: ${cons.join("; ")}. The stock has a beta of ${stock.beta.toFixed(2)}, indicating ${stock.beta > 1.2 ? "above-average" : stock.beta < 0.8 ? "below-average" : "average"} market sensitivity. Current PortfolioPilot Score is ${score}/100. This analysis is based on current financial data — please conduct independent research before making investment decisions.`;
    }
    if (lowerMsg.includes("why") || lowerMsg.includes("rated") || lowerMsg.includes("score")) {
      return `${stock.company} (${ticker}) is rated ${score}/100 by PortfolioPilot. Key factors: ${pros.slice(0, 2).join("; ")}. Score breakdown — Valuation: ${breakdown.valuation}/100, Growth: ${breakdown.growth}/100, Profitability: ${breakdown.profitability}/100, Momentum: ${breakdown.momentum}/100. ${cons.length > 0 ? `Key consideration: ${cons[0]}.` : ""} Investment decisions should be based on your complete financial situation and risk tolerance.`;
    }
    return `${stock.company} (${ticker}) has a PortfolioPilot Score of ${score}/100, with ${stock.revenueGrowth.toFixed(1)}% revenue growth, ${stock.operatingMargin.toFixed(1)}% operating margins, and a ${stock.analystRating} analyst consensus. ${stock.dividendYield ? `The stock currently pays a ${stock.dividendYield.toFixed(2)}% dividend yield.` : "The stock does not currently pay a dividend."} This analysis uses current financial data — past performance does not guarantee future results.`;
  }

  // General investment questions
  if (lowerMsg.includes("diversif")) {
    return "Diversification reduces risk by spreading investments across uncorrelated assets. A well-diversified portfolio typically includes large-cap domestic equities, international developed market exposure, bonds (for risk management), and alternative assets like REITs. The goal is that when one asset class falls, others may hold or rise, smoothing overall portfolio returns over time. PortfolioPilot recommends reviewing sector concentration and geographic exposure regularly.";
  }
  if (lowerMsg.includes("dividend") || lowerMsg.includes("income")) {
    return "Dividend investing focuses on companies that return capital to shareholders through regular payments. Key metrics include dividend yield (annual payment / stock price), payout ratio (dividends / earnings), and dividend growth rate. Sustainable dividends typically come from companies with stable cash flows, low debt, and consistent earnings. PortfolioPilot scores dividend safety based on operating margin, payout history, and free cash flow coverage. Past dividend payments do not guarantee future dividends.";
  }
  if (lowerMsg.includes("valuation") || lowerMsg.includes("pe ratio") || lowerMsg.includes("p/e")) {
    return "Stock valuation compares a company's current price to its fundamental metrics. The P/E ratio (price/earnings) measures how much investors pay per dollar of profit — lower values often indicate better value, but fast-growing companies often trade at premium P/E. The PEG ratio (P/E / growth rate) adjusts for growth — a PEG below 1.0 often signals undervaluation. PortfolioPilot weights valuation metrics against growth quality to compute fair scores. Valuation alone should never drive investment decisions.";
  }
  if (lowerMsg.includes("risk") || lowerMsg.includes("volatility") || lowerMsg.includes("beta")) {
    return "Investment risk measures the potential for loss relative to expected return. Beta measures a stock's price sensitivity to the market — a beta of 1.5 means the stock typically moves 50% more than the market in either direction. PortfolioPilot recommends matching portfolio beta to your risk tolerance: conservative investors should target portfolio beta below 0.8, while aggressive investors may accept 1.2+. Diversification is the primary tool for reducing unsystematic risk without sacrificing expected returns.";
  }

  return "PortfolioPilot's AI assistant analyzes stocks and portfolios using objective financial fundamentals — P/E ratios, revenue growth, operating margins, dividends, analyst ratings, and more. Ask me about specific stocks (e.g., 'Why is Apple rated 88?'), comparisons ('Compare Costco vs Walmart'), or investing concepts. Note that all analysis is based on historical financial data and should not be considered financial advice. Past performance does not guarantee future results.";
}

router.get("/ai/messages", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const sessionId = typeof req.query.sessionId === "string" ? req.query.sessionId : null;

  const whereClause = sessionId
    ? and(eq(chatMessagesTable.userId, userId), eq(chatMessagesTable.sessionId, sessionId))
    : eq(chatMessagesTable.userId, userId);

  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(whereClause)
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(100);

  res.json(
    messages.reverse().map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      sessionId: m.sessionId,
    }))
  );
});

router.post("/ai/chat", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const parsed = AiChatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { message, sessionId: providedSessionId } = parsed.data;
  const sessionId = providedSessionId ?? randomUUID();

  // Save user message
  await db.insert(chatMessagesTable).values({
    userId,
    sessionId,
    role: "user",
    content: message,
  });

  // Get recent conversation history for THIS session only
  const history = await db
    .select()
    .from(chatMessagesTable)
    .where(
      and(
        eq(chatMessagesTable.userId, userId),
        eq(chatMessagesTable.sessionId, sessionId)
      )
    )
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(12);

  const recentHistory = history
    .reverse()
    .slice(0, -1) // exclude the message we just inserted
    .map((m) => ({ role: m.role, content: m.content }));

  // Try OpenAI, fall back to rule-based
  let response: string;
  const aiMessages = [
    {
      role: "system",
      content: `You are PortfolioPilot's AI investment analyst. Answer questions about stocks and portfolios using factual financial data only. Be precise, data-focused, and concise (3-5 sentences). Never predict future prices or guarantee returns. Always include that past performance does not guarantee future results. You have expertise in fundamental analysis: P/E ratios, revenue growth, operating margins, dividend analysis, analyst ratings, risk metrics.`,
    },
    ...recentHistory,
    { role: "user", content: message },
  ];

  const aiResponse = await askAI(aiMessages);
  response = aiResponse ?? buildFallbackResponse(message);

  // Save assistant message
  const [savedMsg] = await db
    .insert(chatMessagesTable)
    .values({ userId, sessionId, role: "assistant", content: response })
    .returning();

  res.json({
    messageId: savedMsg.id,
    response,
    sessionId,
  });
});

export default router;
