/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { NewsletterFormSchema } from "../schemas";
import { cors } from "hono/cors";

const app = new Hono()
  .use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type"],
    })
  )
  .post(
    "/add-email-to-hubspot",
    zValidator("json", NewsletterFormSchema),
    async (c) => {
      const { email, rtApiKey } = c.req.valid("json");

      if (rtApiKey !== process.env.RT_API_KEY) {
        return c.json({
          success: false,
          error: "Invalid Renaud Tixier API key",
        });
      }

      try {
        const response = await fetch(
          `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${email}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              properties: [
                {
                  property: "email",
                  value: email,
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return c.json({ success: true, data });
      } catch (error) {
        console.error("Error registering email in HubSpot:", error);
        if (error instanceof Error) {
          return c.json({ success: false, error: error.message });
        } else {
          return c.json({ success: false, error: "An unknown error occurred" });
        }
      }
    }
  );

export default app;
