import { Router } from "express";
import { roomController } from "../controllers/room.controller";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import { Response, NextFunction } from "express";

const router = Router();

// Public routes (no auth required)
router.get("/rooms/available", (req, res, next) =>
  roomController.getAvailable(req, res, next),
);

// Protected routes (require authentication)
router.use(authMiddleware);

router.get("/rooms", (req: AuthRequest, res: Response, next: NextFunction) =>
  roomController.getAll(req, res, next),
);
router.get("/rooms/:id", (req: AuthRequest, res: Response, next: NextFunction) =>
  roomController.getById(req, res, next),
);
router.post("/rooms", (req: AuthRequest, res: Response, next: NextFunction) =>
  roomController.create(req, res, next),
);
router.put("/rooms/:id", (req: AuthRequest, res: Response, next: NextFunction) =>
  roomController.update(req, res, next),
);
router.delete("/rooms/:id", (req: AuthRequest, res: Response, next: NextFunction) =>
  roomController.delete(req, res, next),
);
router.patch("/rooms/:id/toggle-availability", (req: AuthRequest, res: Response, next: NextFunction) =>
  roomController.toggleAvailability(req, res, next),
);

export default router;