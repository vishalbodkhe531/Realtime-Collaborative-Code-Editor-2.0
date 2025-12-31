import SavedFile from "@/models/SavedFile";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const {
        name,
        description,
        code,
        language,
        roomId,
        username,
    } = await req.json();

    const user = await User.findOne({ username });
    if (!user) {
        return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
        );
    }

    const savedFile = await SavedFile.create({
        name,
        description,
        code,
        language,
        roomId,
        owner: user._id,
    });

    return NextResponse.json({
        success: true,
        fileId: savedFile._id,
    });
}
