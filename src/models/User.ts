import { Schema, Document, models, model, Types } from "mongoose";

export interface IUser extends Document {
    username: string;
    roomId: string;
    savedFiles: Types.ObjectId[];
    room: {
        type: Types.ObjectId,
        ref: "Room",
        default: null,
    };
    joinedAt: Date;
    name: string;
    email: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    username: String,
    roomId: String,
    room: {
        type: Types.ObjectId,
        ref: "Room",
        default: null,
    },
    savedFiles: [{ type: Types.ObjectId, ref: "SavedFile" }],
    joinedAt: { type: Date, default: Date.now },
    password: String,
    name: String,
    email: {
        type: String,
        unique: true,
    },
});


export default models.User || model<IUser>("User", UserSchema);
