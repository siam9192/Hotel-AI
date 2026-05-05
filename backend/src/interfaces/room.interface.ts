export interface Room {
    number: string;
    type: RoomType;
    price: number;
    amenities: string[];
    availability: boolean;
    description: string;
    images: string[];
}


export enum RoomType {
    Single = "Single",
    Double = "Double",
    Suite = "Suite",
    Deluxe = "Deluxe",
    Family = "Family"
}