import { Hono } from "hono";
import { events } from "./routes/events";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/events", events);

export default app;
