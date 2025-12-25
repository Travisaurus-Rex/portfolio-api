import { Hono } from "hono";

type Bindings = {
  ANALYTICS: KVNamespace;
};

export const events = new Hono<{ Bindings: Bindings }>();

events.post("/", async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();

  await c.env.ANALYTICS.put(
    id,
    JSON.stringify({
      ...body,
      timestamp: Date.now(),
    })
  );

  return c.json({ ok: true, id });
});

events.get("/events/:id", async (c) => {
  const id = c.req.param("id");

  const value = await c.env.ANALYTICS.get(id);

  if (!value) {
    return c.json({ error: "not found" }, 404);
  }

  return c.json(JSON.parse(value));
});
