import { Hono } from "hono";
import { events } from "./routes/events";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/debug/geo", (c) => {
  return c.json({
    country: c.req.header("cf-ipcountry"),
    ip: c.req.header("cf-connecting-ip"),
    colo: c.req.header("cf-ray")?.split("-")[1],
    userAgent: c.req.header("user-agent"),
  });
});

app.route("/events", events);

export default app;
