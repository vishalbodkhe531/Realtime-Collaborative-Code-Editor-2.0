"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, LogIn, History } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your collaborative coding rooms
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>

            {/* Create Room */}
            <Button size="lg" className="rounded-2xl">
              <Plus className="mr-2 h-5 w-5" />
              Create Room
            </Button>
          </div>
        </div>


        <Tabs defaultValue="rooms" className="space-y-4">
          <TabsList className="rounded-2xl bg-muted">
            <TabsTrigger value="rooms">My Rooms</TabsTrigger>
            <TabsTrigger value="join">Join Room</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
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
