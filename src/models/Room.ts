import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRoom extends Document {
    roomId: string;
    members: string[];
    userName: string;
    createdAt: Date;
    owner: Types.ObjectId;
}

const RoomSchema = new Schema<IRoom>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);
