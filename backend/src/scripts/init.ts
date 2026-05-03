import { UserRole } from "../interfaces/user.interface";
import { RoomModel } from "../models/room.model";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { adminDemoUsers, guestDemoUsers } from "../demo-data/users";
import { roomsDemoData } from "../demo-data/rooms";

async function initData() {
  console.log("Initializing data...");
  await RoomModel.deleteMany();
  await UserModel.deleteMany();

  // Add any data initialization logic here, such as seeding a database or setting up initial state.await mongoose.connect(config.db_url);
  const insertRooms = await RoomModel.insertMany(roomsDemoData);
  console.log("Rooms inserted: ", insertRooms.length);

  await insertUsers(guestDemoUsers, UserRole.Guest);
  await insertUsers(adminDemoUsers, UserRole.Admin);
  console.log("Users inserted: ", insertUsers.length);
  console.log("Data initialization complete.");
}

async function insertUsers(
  users: { name: string; email: string; password: string }[],
  role: UserRole,
) {
  const insertUsers = users as any[];

  insertUsers.forEach(async (user) => {
    user.hashedPassword = await bcrypt.hash(user.password, 12);
    user.role = role;
  });

  return await UserModel.insertMany(insertUsers);
}

initData();
