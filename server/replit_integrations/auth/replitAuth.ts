import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";
import { db } from "../../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Use secure cookies in production (HTTPS), plain HTTP in development
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  // Register: create a new user by email + name
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      const { email, firstName, lastName } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()));
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const user = await authStorage.upsertUser({
        email: email.toLowerCase(),
        firstName: firstName || email.split("@")[0],
        lastName: lastName || "",
        profileImageUrl: `https://avatar.iran.liara.run/public/boy?username=${email}`,
      });
      const sessionUser = {
        id: user.id,
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      };
      req.login(sessionUser, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err: any) {
      next(err);
    }
  });

  // Login: find user by email and start session
  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()));
      if (existingUsers.length === 0) {
        return res.status(400).json({ message: "User not found. Please register." });
      }
      const user = existingUsers[0];
      const sessionUser = {
        id: user.id,
        claims: {
          sub: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
      };
      req.login(sessionUser, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    } catch (err: any) {
      next(err);
    }
  });

  app.get("/api/login", (_req, res) => res.redirect("/login"));
  app.get("/api/callback", (_req, res) => res.redirect("/"));
  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  // Session expired — user must log in again
  res.status(401).json({ message: "Session expired. Please log in again." });
};
