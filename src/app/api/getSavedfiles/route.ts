import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import "@/models/SavedFile";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email })
            .populate("savedFiles");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            savedFiles: user.savedFiles,
        });
    } catch (error) {
        console.log("error : ", error);

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}
