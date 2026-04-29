import { RoomModel, IRoom } from "../models/room.model";
import { RoomType } from "../interfaces/room.interface";
import { AppError } from "../utils/error.utils";

export class RoomService {
  async create(data: Partial<IRoom>): Promise<IRoom> {
    const room = new RoomModel(data);
    return room.save();
  }

  async findById(id: string): Promise<IRoom> {
    const room = await RoomModel.findOne({ id });
    if (!room) {
      throw new AppError("Room not found", 404);
    }
    return room;
  }

  async findByNumber(number: string): Promise<IRoom | null> {
    return RoomModel.findOne({ number });
  }

  async findAll(): Promise<IRoom[]> {
    return RoomModel.find();
  }

  async update(id: string, data: Partial<IRoom>): Promise<IRoom> {
    const room = await RoomModel.findOneAndUpdate({ id }, data, { new: true });
    if (!room) {
      throw new AppError("Room not found", 404);
    }
    return room;
  }

  async delete(id: string): Promise<IRoom> {
    const room = await RoomModel.findOneAndDelete({ id });
    if (!room) {
      throw new AppError("Room not found", 404);
    }
    return room;
  }

  async findByType(type: RoomType): Promise<IRoom[]> {
    return RoomModel.find({ type });
  }

  async findAvailable(): Promise<IRoom[]> {
    return RoomModel.find({ availability: true });
  }

  async findByPriceRange(min: number, max: number): Promise<IRoom[]> {
    return RoomModel.find({ price: { $gte: min, $lte: max } });
  }

  async toggleAvailability(id: string): Promise<IRoom> {
    const room = await RoomModel.findOne({ id });
    if (!room) {
      throw new AppError("Room not found", 404);
    }
    room.availability = !room.availability;
    return room.save();
  }
}

export const roomService = new RoomService();
