"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSavedfiles } from "@/hooks/useGetSavedfiles";
import { CodeFile } from "@/types/appTypes";
import Loading from "@/components/code-editor/Loading";

import { Button } from "@/components/ui/button";
import SavedCodeMirror from "../page";

export default function SavedEditorPage() {
    const { fileId } = useParams<{ fileId: string }>();
    const router = useRouter();

    const [file, setFile] = useState<CodeFile | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchFile = async () => {
            const files: CodeFile[] = await getSavedfiles();

            const found = files.find((f: CodeFile) => f._id === fileId);

            setFile(found || null);
            setLoading(false);
        };

        fetchFile();
    }, [fileId]);


    if (loading) return <Loading />;
    if (!file) return <p className="p-6">File not found</p>;

    return (
        <div className="h-screen flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 border-b">
                <div>
                    <h2 className="font-semibold">{file.name}</h2>
                    <p className="text-sm text-muted-foreground">
                        {file.language}
                    </p>
                </div>

                <Button variant="outline" onClick={() => router.back()} className="cursor-pointer">
                    Back
                </Button>
            </div>

            <div className="flex-1">
                <SavedCodeMirror
                    code={file.code}
                    language={file.language}
                    readOnly={false}
                />
            </div>
        </div>
    );
}
