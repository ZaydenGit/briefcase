import { Router } from "express";
import { listAll, remove, update } from "../controllers/incomeController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/", listAll);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
