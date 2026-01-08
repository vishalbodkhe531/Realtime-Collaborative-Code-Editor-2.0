import { connectDB } from "@/lib/mongodb";
import Room from "@/models/Room";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        const { username, roomId } = await req.json();

        if (!username || !roomId) {
            return NextResponse.json(
                { error: "Username and Room ID required" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        let room = await Room.findOne({ roomId });

        if (room) {
            if (room.members.includes(username)) {
                return NextResponse.json(
                    { error: "Username already exists in this room" },
                    { status: 400 }
                );
            }

            room.members.push(username);
            await room.save();
        }
        else {
            room = await Room.create({
                owner: user._id,
                roomId,
                members: [username],
            });
        }

        user.username = username;
        user.roomId = roomId;
        user.room = room._id;
        await user.save();

        const response = NextResponse.json({
            success: true,
            roomId: room.roomId,
            roomOwnerId: room.owner.toString(),
            username,
        });

        response.cookies.set("username", username, { path: "/" });
        response.cookies.set("roomId", roomId, { path: "/" });

        return response;
    } catch (err) {
        console.error("Error joining room:", err);
        return NextResponse.json(
            { error: "Failed to join room" },
            { status: 500 }
        );
    }
}
