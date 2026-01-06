"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { History, LogIn, Plus, X } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import Loading from "@/components/code-editor/Loading"
import JoinForm from "./join-form/page"

export default function Dashboard() {

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

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
            <TabsTrigger value="join" className="cursor-pointer">Join Room</TabsTrigger>
            <TabsTrigger value="history" className="cursor-pointer">History</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((room) => (
                <Card
                  key={room}
                  className="rounded-2xl border border-border bg-card shadow-sm"
                >
                  <CardHeader>
                    <CardTitle>Room #{room}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Last active: 2 hours ago
                    </p>
                    <Button className="w-full rounded-xl">
                      Open Editor
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="join">
            <Card className="max-w-md rounded-2xl border border-border bg-card">
              <CardHeader>
                <CardTitle>Join Existing Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  placeholder="Enter Room ID"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button className="w-full rounded-xl">
                  <LogIn className="mr-2 h-4 w-4" /> Join Room
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <Card
                  key={item}
                  className="rounded-2xl border border-border bg-card"
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">Room ABC{item}</p>
                      <p className="text-sm text-muted-foreground">
                        Exited on 2024-06-12
                      </p>
                    </div>
                    <History className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}



