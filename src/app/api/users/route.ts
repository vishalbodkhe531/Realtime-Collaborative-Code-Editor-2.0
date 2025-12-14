import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const roomId = searchParams.get("roomId");

        if (!roomId) {
            return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
        }

        const room = await Room.findOne({ roomId }).select("members");

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        return NextResponse.json({ members: room.members });
    } catch (err: any) {
        console.error("Error fetching room members:", err);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}