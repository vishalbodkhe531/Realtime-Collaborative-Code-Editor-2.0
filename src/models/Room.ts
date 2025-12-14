import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
    roomId: string;
    members: string[];
    createdAt: Date;
}

const RoomSchema = new Schema<IRoom>({
    roomId: { type: String, required: true, unique: true },
    members: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);
