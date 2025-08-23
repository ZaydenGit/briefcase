import { Router } from "express";
import { getAuthenticatedUser, login, logout, register } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getAuthenticatedUser);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
