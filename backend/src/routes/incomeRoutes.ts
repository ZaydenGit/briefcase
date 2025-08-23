import { Router } from "express";
import { list, create, remove, update } from "../controllers/incomeController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", list);
router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;
