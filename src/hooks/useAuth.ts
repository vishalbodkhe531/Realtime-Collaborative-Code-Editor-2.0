import { signUpType } from "@/validation/formsValidation";


export const signUp = async (data: signUpType) => {
    const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to sign up");
    }

    return res.json();
}