import { Schema, Document, models, model, Types } from "mongoose";

export interface IUser extends Document {
    username: string;
    roomId: string;
    savedFiles: Types.ObjectId[];
    joinedAt: Date;
    name: string;
    email: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    username: String,
    roomId: String,
    savedFiles: [{ type: Types.ObjectId, ref: "SavedFile" }],
    joinedAt: { type: Date, default: Date.now },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export default models.User || model<IUser>("User", UserSchema);
