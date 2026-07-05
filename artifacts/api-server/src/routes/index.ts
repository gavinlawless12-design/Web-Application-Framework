import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import recommendationsRouter from "./recommendations";
import portfolioRouter from "./portfolio";
import stocksRouter from "./stocks";
import watchlistRouter from "./watchlist";
import screenerRouter from "./screener";
import aiRouter from "./ai";
import marketRouter from "./market";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(recommendationsRouter);
router.use(portfolioRouter);
router.use(stocksRouter);
router.use(watchlistRouter);
router.use(screenerRouter);
router.use(aiRouter);
router.use(marketRouter);

export default router;
