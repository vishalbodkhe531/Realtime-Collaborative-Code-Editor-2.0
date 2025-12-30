"use client";

import { EditorShell } from "@/components/code-editor/EditorShell";
import Loading from "@/components/code-editor/Loading";
import { useFetchSession } from "@/hooks/useFetchSession";
import { Room } from "@/utils/Room";

const EditorPage = () => {
    const { username, roomId, loading } = useFetchSession();

    if (loading) return <Loading />;

    if (!username || !roomId) {
        return (
            <div className="flex items-center justify-center h-screen">
                Please join a room first.
            </div>
        );
    }

    return (
        <Room>
            <EditorShell username={username} roomId={roomId} />
        </Room>
    );
};

export default EditorPage;
