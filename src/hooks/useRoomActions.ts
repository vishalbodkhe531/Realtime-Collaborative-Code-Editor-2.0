import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseRoomActionsProps {
  username: string;
  roomId: string;
  provider?: any;
  view?: any;
  language: string;
}

export function useRoomActions({ username, roomId, provider, view, language }: UseRoomActionsProps) {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>("");

  const handleExit = async () => {
    try {
      await fetch("/api/exit-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, roomId }),
      });

      provider?.awareness.setLocalStateField("user", null);

      router.push("/join-form");
    } catch (err) {
      console.error("Failed to exit room:", err);
    }
  };

  const handleRun = async () => {
    if (!view) return;

    const code = view.state.doc.toString();
    setIsRunning(true);
    setOutput("Running...");

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });

      const data = await res.json();
      if (data.output) setOutput(data.output);
      else setOutput(data.error || "No output");
    } catch (err) {
      console.error("Error:", err);
      setOutput("Execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    output,
    handleExit,
    handleRun,
    setOutput,
  };
}
