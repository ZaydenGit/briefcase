import { Router } from "express";
import { contribute, create, list, remove, update } from "../controllers/goalController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", list);
router.post("/", create);
router.patch("/:id", update);
router.post("/:id/contribute", contribute);
router.delete("/:id", remove);

export default router;
