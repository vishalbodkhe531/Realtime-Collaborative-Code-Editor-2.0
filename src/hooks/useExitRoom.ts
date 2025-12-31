import { SaveFileDataType } from "@/types/appTypes";

export const saveFile = async (data: SaveFileDataType) => {
    const res = await fetch("/api/saveFile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to save file");
    }

    return res.json();
};
