import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, watchlistsTable, watchlistItemsTable } from "@workspace/db";
import { CreateWatchlistBody, AddToWatchlistBody } from "@workspace/api-zod";
import { getStock } from "../lib/stockData";
import { calculateScore } from "../lib/scoring";

const router = Router();
const DEFAULT_USER = "guest-001";

function getUserId(req: any): string {
  return (req.headers["x-user-id"] as string) || DEFAULT_USER;
}

/** Returns the watchlist row only when it belongs to the current user, or null. */
async function getOwnedWatchlist(watchlistId: number, userId: string) {
  const [wl] = await db
    .select()
    .from(watchlistsTable)
    .where(and(eq(watchlistsTable.id, watchlistId), eq(watchlistsTable.userId, userId)));
  return wl ?? null;
}

async function buildWatchlistResponse(wl: typeof watchlistsTable.$inferSelect) {
  const items = await db
    .select()
    .from(watchlistItemsTable)
    .where(eq(watchlistItemsTable.watchlistId, wl.id));

  const enrichedItems = items.map((item) => {
    const stock = getStock(item.ticker);
    const score = stock ? calculateScore(stock).score : 50;
    return {
      id: item.id,
      watchlistId: item.watchlistId,
      ticker: item.ticker,
      company: stock?.company ?? item.ticker,
      price: stock?.price ?? 0,
      change1dPct: stock?.change1dPct ?? 0,
      score,
      addedAt: item.addedAt.toISOString(),
    };
  });

  return {
    id: wl.id,
    userId: wl.userId,
    name: wl.name,
    items: enrichedItems,
    createdAt: wl.createdAt.toISOString(),
  };
}

router.get("/watchlists", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const watchlists = await db
    .select()
    .from(watchlistsTable)
    .where(eq(watchlistsTable.userId, userId));

  const result = await Promise.all(watchlists.map(buildWatchlistResponse));
  res.json(result);
});

router.post("/watchlists", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const parsed = CreateWatchlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [wl] = await db
    .insert(watchlistsTable)
    .values({ userId, name: parsed.data.name })
    .returning();

  res.status(201).json(await buildWatchlistResponse(wl));
});

router.delete("/watchlists/:id", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid watchlist ID" });
    return;
  }

  // Verify ownership before deletion
  const owned = await getOwnedWatchlist(id, userId);
  if (!owned) {
    res.status(404).json({ error: "Watchlist not found" });
    return;
  }

  // Delete items then the watchlist
  await db.delete(watchlistItemsTable).where(eq(watchlistItemsTable.watchlistId, id));
  await db.delete(watchlistsTable).where(eq(watchlistsTable.id, id));
  res.json({ success: true });
});

router.post("/watchlists/:id/items", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const watchlistId = parseInt(raw, 10);
  if (isNaN(watchlistId)) {
    res.status(400).json({ error: "Invalid watchlist ID" });
    return;
  }

  // Verify ownership before insert
  const owned = await getOwnedWatchlist(watchlistId, userId);
  if (!owned) {
    res.status(404).json({ error: "Watchlist not found" });
    return;
  }

  const parsed = AddToWatchlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const ticker = parsed.data.ticker.toUpperCase();
  const stock = getStock(ticker);
  const [item] = await db
    .insert(watchlistItemsTable)
    .values({ watchlistId, ticker })
    .returning();

  const score = stock ? calculateScore(stock).score : 50;
  res.status(201).json({
    id: item.id,
    watchlistId: item.watchlistId,
    ticker: item.ticker,
    company: stock?.company ?? ticker,
    price: stock?.price ?? 0,
    change1dPct: stock?.change1dPct ?? 0,
    score,
    addedAt: item.addedAt.toISOString(),
  });
});

router.delete("/watchlists/:id/items/:ticker", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const watchlistId = parseInt(raw, 10);
  const tickerRaw = Array.isArray(req.params.ticker) ? req.params.ticker[0] : req.params.ticker;
  const ticker = tickerRaw?.toUpperCase();
  if (isNaN(watchlistId) || !ticker) {
    res.status(400).json({ error: "Invalid parameters" });
    return;
  }

  // Verify ownership before deletion
  const owned = await getOwnedWatchlist(watchlistId, userId);
  if (!owned) {
    res.status(404).json({ error: "Watchlist not found" });
    return;
  }

  await db
    .delete(watchlistItemsTable)
    .where(
      and(
        eq(watchlistItemsTable.watchlistId, watchlistId),
        eq(watchlistItemsTable.ticker, ticker)
      )
    );
  res.json({ success: true });
});

export default router;
