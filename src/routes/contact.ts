import { Hono } from "hono";
import { Resend } from "resend";

type Env = {
  Bindings: {
    ANALYTICS: KVNamespace;
    RESEND_API_KEY: string;
  };
};

export const contact = new Hono<Env>();

contact.post("/", async (c) => {
  const ip = c.req.header("cf-connecting-ip") ?? "unknown";
  const key = `contact:${ip}`;

  const count = Number((await c.env.ANALYTICS.get(key)) ?? 0);
  if (count > 5) {
    return c.json({ error: "Too many requests" }, 429);
  }

  await c.env.ANALYTICS.put(key, String(count + 1), { expirationTtl: 3600 });

  const { name, email, message } = await c.req.json();

  if (!name || !email || !message) {
    return c.json({ message: "Missing fields" }, 400);
  }

  const resend = new Resend(c.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "Portfolio <contact@codedbytravis.com>",
    to: ["tadamsdeveloper@gmail.com"],
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `
    New portfolio contact submission
    
    Name: ${name}
    Email: ${email}
    
    Message:
    ${message}
    `,
  });

  return c.json({ ok: true });
});
