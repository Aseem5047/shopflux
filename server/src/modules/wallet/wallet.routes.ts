import { Router } from "express";
import {
	getMyWallet,
	creditUserWallet,
	debitUserWallet,
} from "./wallet.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/me", requireAuth, getMyWallet);

router.post("/internal/credit", creditUserWallet);
router.post("/internal/debit", debitUserWallet);

export default router;
