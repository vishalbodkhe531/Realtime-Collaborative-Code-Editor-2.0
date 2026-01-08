"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { History, LogIn, Plus, X } from "lucide-react"

import Loading from "@/components/code-editor/Loading"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { getSavedfiles } from "@/hooks/useGetSavedfiles"
import { CodeFile } from "@/types/appTypes"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import JoinForm from "./join-form/page"

export default function Dashboard() {

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<CodeFile[]>([]);
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const fetchFiles = async () => {
      const savedFiles = await getSavedfiles();
      setFiles(savedFiles);
    };
    fetchFiles();
  }, []);

  if (status === "loading") return <Loading />;

  const handleLogin = () => {
    setLoading(true);
    router.push("/sign-in");
  }

  const handleLogout = async () => {
    toast.success("Logged out successfully");
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground ">
      <div className="mx-auto max-w-6xl space-y-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Codexia</h1>
            <p className="text-sm text-muted-foreground">
              Manage your collaborative coding rooms
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1 ">
              <ThemeToggle />
            </div>

            <AlertDialog>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <AlertDialogTrigger asChild>
                    <Button
                      size="lg"
                      className="rounded-2xl cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={loading}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Create Room
                    </Button>
                  </AlertDialogTrigger>

                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-2xl cursor-pointer border-destructive text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="rounded-2xl cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Login
                </Button>
              )}

              <AlertDialogContent className="border py-12 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                <AlertDialogTitle className="text-center text-lg font-semibold">
                  Join CollabCode
                </AlertDialogTitle>

                <AlertDialogCancel asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-5 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </AlertDialogCancel>
                <JoinForm />
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <Tabs defaultValue="rooms" className="space-y-4">
          <TabsList className="rounded-2xl bg-muted">
            <TabsTrigger value="rooms" className="cursor-pointer">My Rooms</TabsTrigger>
            <TabsTrigger value="history" className="cursor-pointer">History</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {files.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  No files found. Create a file to get started.
                </p>
              ) : (
                files.map((file) => (
                  <Card
                    key={file._id}
                    className="rounded-2xl border border-border bg-card shadow-sm"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{file.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">
                          {file.language}
                        </span>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {file.description ? (
                        <p className="text-sm text-muted-foreground">
                          {file.description}
                        </p>
                      ) : <p className="text-sm text-muted-foreground">No Description</p>}

                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(file.createdAt).toLocaleString()}
                      </p>

                      <Button className="w-full rounded-xl cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
                        Open Editor
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}

            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {files.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  No history found.
                </p>
              ) : (
                files.map((file) => (
                  <Card
                    key={file._id}
                    className="rounded-2xl border border-border bg-card"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">
                          {file.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last edited on{" "}
                          {new Date(file.updatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <History className="h-5 w-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}