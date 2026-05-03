import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { catchAsync } from "../utils/error.utils";

export class UserController {
  create = catchAsync(async (req, res: Response) => {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  });

  getById = catchAsync(async (req, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.findById(id);
    res.json(user);
  });

  getAll = catchAsync(async (req, res: Response) => {
    const users = await userService.findAll();
    res.json(users);
  });

  update = catchAsync(async (req, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.update(id, req.body);
    res.json(user);
  });

  delete = catchAsync(async (req, res: Response) => {
    const { id } = req.params as { id: string };
    await userService.delete(id);
    res.json({ message: "User deleted successfully" });
  });
}

export const userController = new UserController();
