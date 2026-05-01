import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/auth/signup", authController.signup);
router.post("/auth/signin", authController.signin);

// Protected routes
router.post(
  "/auth/change-password/:id",
  authMiddleware,
  authController.changePassword,
);
router.get("/auth/me/:id", authMiddleware, authController.getMe);

export default router;
