import { Router, type IRouter } from "express";
import healthRouter from "./health";
import generateBioRouter from "./generate-bio";

const router: IRouter = Router();

router.use(healthRouter);
router.use(generateBioRouter);

export default router;
