import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = cookies();
        const username = (await cookieStore).get("username")?.value;
        const roomId = (await cookieStore).get("roomId")?.value;

        if (!username || !roomId) {
            return NextResponse.json({ error: "No session found" }, { status: 404 });
        }

        return NextResponse.json({ username, roomId });
    } catch (err) {
        console.error("Failed to get session from cookies:", err);
        return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
    }
}
