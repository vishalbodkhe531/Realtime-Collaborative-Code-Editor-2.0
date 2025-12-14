import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { username, roomId } = await req.json();

        if (!username || !roomId) {
            return NextResponse.json(
                { error: "Username and Room ID required" },
                { status: 400 }
            );
        }

        await User.deleteOne({ username, roomId });

        const room = await Room.findOne({ roomId });
        if (room) {
            room.members = room.members.filter((member: string) => member !== username);
            if (room.members.length === 0) {
                await Room.deleteOne({ roomId });
            } else {
                await room.save();
            }
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set("username", "", { path: "/", maxAge: 0 });
        response.cookies.set("roomId", "", { path: "/", maxAge: 0 });

        return response;
    } catch (err: any) {
        console.error("Error exiting room:", err);
        return NextResponse.json(
            { error: "Failed to exit room" },
            { status: 500 }
        );
    }
}
