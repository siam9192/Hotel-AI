import { Request, Response } from "express";
import { roomService } from "../services/room.service";
import { catchAsync } from "../utils/error.utils";

export class RoomController {
  create = catchAsync(async (req: Request, res: Response) => {
    const room = await roomService.create(req.body);
    res.status(201).json(room);
  });

  getById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const room = await roomService.findById(id);
    res.json(room);
  });

  getAll = catchAsync(async (req: Request, res: Response) => {
    const rooms = await roomService.findAll();
    res.json(rooms);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const room = await roomService.update(id, req.body);
    res.json(room);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await roomService.delete(id);
    res.json({ message: "Room deleted successfully" });
  });

  getAvailable = catchAsync(async (req: Request, res: Response) => {
    const rooms = await roomService.findAvailable();
    res.json(rooms);
  });

  toggleAvailability = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const room = await roomService.toggleAvailability(id);
    res.json(room);
  });
}

export const roomController = new RoomController();
