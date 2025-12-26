import { Hono } from "hono";
import { cors } from "hono/cors";
import { events } from "./routes/events";
import { contact } from "./routes/contact";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/debug/geo", (c) => {
  return c.json({
    country: c.req.header("cf-ipcountry"),
    ip: c.req.header("cf-connecting-ip"),
    colo: c.req.header("cf-ray")?.split("-")[1],
    userAgent: c.req.header("user-agent"),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
});

app.route("/events", events);
app.route("/contact", contact);

export default app;
