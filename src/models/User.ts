import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    roomId: string;
    joinedAt: Date;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    roomId: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
