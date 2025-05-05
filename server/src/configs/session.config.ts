import session from "express-session";
import { RedisStore } from "connect-redis";
import { redisClient } from "./redis";
const sessionSecret = process.env.SESSION_SECRET!;

const sessionConfig = session({
  store: new RedisStore({ client: redisClient, ttl: 86400 }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

export default sessionConfig;
