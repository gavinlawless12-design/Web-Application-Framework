import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, investorProfilesTable } from "@workspace/db";
import { UpsertProfileBody } from "@workspace/api-zod";

const router = Router();
const DEFAULT_USER = "guest-001";

function getUserId(req: any): string {
  return (req.headers["x-user-id"] as string) || DEFAULT_USER;
}

function serializeProfile(p: typeof investorProfilesTable.$inferSelect) {
  return {
    id: p.id,
    userId: p.userId,
    goal: p.goal,
    horizon: p.horizon,
    riskTolerance: p.riskTolerance,
    dividendPreference: p.dividendPreference,
    internationalExposure: p.internationalExposure,
    smallCapPreference: p.smallCapPreference,
    sectors: (p.sectors as string[]) ?? [],
    esgPreference: p.esgPreference,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/profile", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const [profile] = await db
    .select()
    .from(investorProfilesTable)
    .where(eq(investorProfilesTable.userId, userId));

  if (!profile) {
    res.status(404).json({ error: "No investor profile found" });
    return;
  }
  res.json(serializeProfile(profile));
});

router.post("/profile", async (req, res): Promise<void> => {
  const userId = getUserId(req);
  const parsed = UpsertProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = parsed.data;

  const [existing] = await db
    .select({ id: investorProfilesTable.id })
    .from(investorProfilesTable)
    .where(eq(investorProfilesTable.userId, userId));

  let profile;
  if (existing) {
    [profile] = await db
      .update(investorProfilesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(investorProfilesTable.userId, userId))
      .returning();
  } else {
    [profile] = await db
      .insert(investorProfilesTable)
      .values({ userId, ...data })
      .returning();
  }

  res.json(serializeProfile(profile));
});

export default router;
