import { Router } from "express";
import {
	login,
	register,
	logout,
	getProfile,
	refresh,
} from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", requireAuth, getProfile);

export default router;
