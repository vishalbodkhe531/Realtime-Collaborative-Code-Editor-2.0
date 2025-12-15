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

        const existingUser = await User.findOne({ username, roomId });
        if (existingUser) {
            return NextResponse.json(
                { error: "Username already exists in this room" },
                { status: 400 }
            );
        }

        let room = await Room.findOne({ roomId });
        if (!room) {
            room = await Room.create({ roomId, members: [username] });
        } else if (!room.members.includes(username)) {
            room.members.push(username);
            await room.save();
        }

        await User.create({ username, roomId });

        const response = NextResponse.json({ success: true, username, roomId });
        response.cookies.set("username", username, { path: "/" });
        response.cookies.set("roomId", roomId, { path: "/" });

        return response;
    } catch (err: any) {
        console.error("Error joining room:", err);
        return NextResponse.json(
            { error: "Failed to join room" },
            { status: 500 }
        );
    }
}
