import { Request, Response } from "express";
import { db } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { SignJWT } from "jose";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export function getDiscordLoginUrl() {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email",
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function handleDiscordCallback(req: Request, res: Response) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).send("Missing authorization code");
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user info from Discord
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const discordUser = await userResponse.json();

    // Check if user exists in database
    const existingUsers = await db.select().from(users).where(eq(users.openId, discordUser.id)).limit(1);
    let user = existingUsers.length > 0 ? existingUsers[0] : null;

    if (!user) {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          openId: discordUser.id,
          name: discordUser.username,
          email: discordUser.email || `${discordUser.id}@discord.user`,
          avatar: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null,
          role: "user",
        })
        .$returningId();
      
      const newUserResult = await db.select().from(users).where(eq(users.id, newUser.id)).limit(1);
      user = newUserResult[0];
    } else {
      // Update existing user info
      await db
        .update(users)
        .set({
          name: discordUser.username,
          email: discordUser.email || user.email,
          avatar: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : user.avatar,
        })
        .where(eq(users.id, user.id));
    }

    // Create session token with correct format for sdk.verifySession
    const token = await new SignJWT({
      openId: user!.openId,
      appId: process.env.VITE_APP_ID || "riverside-primary-school",
      name: user!.name || "",
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime("30d")
      .sign(JWT_SECRET);

    // Set session cookie
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(COOKIE_NAME, token, cookieOptions);

    // Redirect to home page
    res.redirect("/");
  } catch (error) {
    console.error("Discord OAuth error:", error);
    res.status(500).send("Authentication failed");
  }
}
