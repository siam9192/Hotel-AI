export interface User {    
id: string;
name: string;
email: string;
hashedPassword: string;
profilePictureUrl?: string;
role: UserRole;
}


export enum UserRole {
Admin = "Admin",
Guest = "Guest"
}