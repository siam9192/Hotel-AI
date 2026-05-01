import { Router } from "express";
import { roomController } from "../controllers/room.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes (no auth required)
router.get("/rooms/available", roomController.getAvailable);

// Protected routes (require authentication)
router.use(authMiddleware);

router.get("/rooms", roomController.getAll);
router.get("/rooms/:id", roomController.getById);
router.post("/rooms", roomController.create);
router.put("/rooms/:id", roomController.update);
router.delete("/rooms/:id", roomController.delete);
router.patch("/rooms/:id/toggle-availability", roomController.toggleAvailability);

export default router;
