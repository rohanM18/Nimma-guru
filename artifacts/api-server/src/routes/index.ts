import { Router } from "express";
import healthRouter from "./health.js";
import generateBioRouter from "./generate-bio.js";
import { HealthCheckResponse } from "@workspace/api-zod";

const router = Router();

router.use(healthRouter);
router.use(generateBioRouter);

export default router;
