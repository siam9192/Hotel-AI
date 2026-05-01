import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import { Response, NextFunction } from "express";

const router = Router();

// Public routes
router.post("/auth/signup", (req, res, next) => authController.signup(req, res, next));
router.post("/auth/signin", (req, res, next) => authController.signin(req, res, next));

// Protected routes
router.post(
  "/auth/change-password/:id",
  authMiddleware,
  (req: AuthRequest, res: Response, next: NextFunction) =>
    authController.changePassword(req, res, next),
);
router.get(
  "/auth/me/:id",
  authMiddleware,
  (req: AuthRequest, res: Response, next: NextFunction) =>
    authController.getMe(req, res, next),
);

export default router;