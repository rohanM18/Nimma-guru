import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import generateBioRouter from "./generate-bio.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(generateBioRouter);

export default router;
