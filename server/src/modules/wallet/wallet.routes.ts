import { Router } from "express";
import {
	getMyWallet,
	creditUserWallet,
	debitUserWallet,
} from "./wallet.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireInternalAuth } from "../../middlewares/internal.middleware";

const router = Router();

router.get("/me", requireAuth, getMyWallet);

router.post("/credit", requireInternalAuth, creditUserWallet);
router.post("/debit", requireInternalAuth, debitUserWallet);

export default router;
