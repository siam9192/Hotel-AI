import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import { Response, NextFunction } from "express";

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get("/users", (req: AuthRequest, res: Response, next: NextFunction) =>
  userController.getAll(req, res, next),
);
router.get("/users/:id", (req: AuthRequest, res: Response, next: NextFunction) =>
  userController.getById(req, res, next),
);
router.post("/users", (req: AuthRequest, res: Response, next: NextFunction) =>
  userController.create(req, res, next),
);
router.put("/users/:id", (req: AuthRequest, res: Response, next: NextFunction) =>
  userController.update(req, res, next),
);
router.delete("/users/:id", (req: AuthRequest, res: Response, next: NextFunction) =>
  userController.delete(req, res, next),
);

export default router;