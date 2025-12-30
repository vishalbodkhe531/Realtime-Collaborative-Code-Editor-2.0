import { joinFormType, joinSchema } from "../validation/formsValidation";

export const handleJoinForm = async (data: joinFormType) => {
    try {
        const validated = joinSchema.parse(data);

        const res = await fetch("/api/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validated),
        });

        const json = await res.json();

        if (!res.ok) {
            return {
                success: false,
                errorType: "server",
                error: json.error || "Server error",
            };
        }

        return {
            success: true,
            data: json,
        };
    } catch (err: any) {
        if (err?.issues) {
            return {
                success: false,
                errorType: "validation",
                errors: err.issues,
            };
        }

        return {
            success: false,
            errorType: "server",
            error: err.message || "Unknown error",
        };
    }
};
