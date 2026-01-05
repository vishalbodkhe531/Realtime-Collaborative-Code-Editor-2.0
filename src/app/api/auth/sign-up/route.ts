import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signUpSchema } from "@/validation/formsValidation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, email, password } = signUpSchema.parse(body);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const res = await User.create({
            name,
            email,
            password: hashedPassword,
        });


        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message ?? "Something went wrong" },
            { status: 500 }
        );
    }
}
