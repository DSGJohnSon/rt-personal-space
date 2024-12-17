/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { handle } from "hono/vercel";

import auth from "@/features/auth/server/route";
import hubspotLink from "@/features/newsletter/server/route";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth).route("/hubspot-link", hubspotLink);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
