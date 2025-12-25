import { Hono } from "hono";
import { View } from "./view";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/message", (c) => {
  return c.json({
    message: "Hello, this is my message to you!",
    stunned: true,
    complicated: false,
    currentTime: new Date(),
  });
});

app.get("/post/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");
  c.header("X-Message", "Hi!");
  return c.text(`You want to see ${page} of ${id}`);
});

app.get("/view", (c) => {
  return c.html(<View />);
});

export default app;
