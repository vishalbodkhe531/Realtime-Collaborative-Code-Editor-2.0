import { Liveblocks } from "@liveblocks/node";
import { cookies } from "next/headers";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST() {
  const cookieStore = await cookies();
  const username = cookieStore.get("username")?.value;
  const roomId = cookieStore.get("roomId")?.value;

  if (!username || !roomId) {
    return new Response(JSON.stringify({ error: "Missing session data" }), { status: 400 });
  }

  const session = liveblocks.prepareSession(username, {
    userInfo: {
      name: username, 
      color: "#" + ((1 << 24) * Math.random() | 0).toString(16),
      picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
    },
  });

  session.allow(`liveblocks:examples:${roomId}`, session.FULL_ACCESS);

  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
