import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { language, code } = await req.json();

        const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!, 
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            body: JSON.stringify({
                source_code: code,
                language_id: getLanguageId(language),
            }),
        });

        const result = await response.json();
        return NextResponse.json({ output: result.stdout || result.stderr || "No output" });
    } catch (error) {
        console.error("Error running code:", error);
        return NextResponse.json({ error: "Failed to execute code" }, { status: 500 });
    }
}

function getLanguageId(lang: string) {
    switch (lang) {
        case "cpp": return 54;
        case "python": return 71;
        case "java": return 62;
        case "javascript": return 63;
        default: return 63;
    }
}
