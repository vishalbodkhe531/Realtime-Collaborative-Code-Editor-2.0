import { Schema, Document, models, model, Types } from "mongoose";

export interface IUser extends Document {
    username: string;
    roomId: string;
    savedFiles: Types.ObjectId[];
    joinedAt: Date;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    roomId: { type: String, required: true },
    savedFiles: [{ type: Types.ObjectId, ref: "SavedFile" }],
    joinedAt: { type: Date, default: Date.now },
});

export default models.User || model<IUser>("User", UserSchema);
