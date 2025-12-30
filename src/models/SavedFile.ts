import { Schema, Document, Types, models, model } from "mongoose";

export interface ISavedFile extends Document {
    name: string;
    description?: string;
    code: string;
    language: string;
    owner: Types.ObjectId;
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
}

const SavedFileSchema = new Schema<ISavedFile>(
    {
        name: { type: String, required: true },
        description: { type: String },
        code: { type: String, required: true },
        language: { type: String, required: true },
        roomId: { type: String, required: true },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },  
    },
    { timestamps: true }
);

export default models.SavedFile ||
    model<ISavedFile>("SavedFile", SavedFileSchema);
