/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import {
  LoginSchema,
  RegisterAdminSchema,
  RegisterWarrantySchema,
} from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import { HTTPException } from "hono/http-exception";

const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");

    return c.json({ data: user });
  })
  .post("/login", zValidator("json", LoginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post(
    "/register-warranty",
    zValidator("json", RegisterWarrantySchema),
    async (c) => {
      const {
        civility,
        firstname,
        name,
        email,
        phone,
        birthDate,
        country,
        password,
        serial,
        placeOfPurchase,
        purchaseDate,
        terms,
        requestWarranty,
      } = c.req.valid("json");

      try {
        const { account, databases } = await createAdminClient();

        const user = await account.create(ID.unique(), email, password, name);

        const userInfo = await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_USERINFO_COLLECTION!,
          ID.unique(),
          {
            userId: user.$id,
            firstname,
            name,
            civility,
            phone,
            birthDate,
            country,
            serial,
            placeOfPurchase,
            purchaseDate,
            terms,
            requestWarranty,
          }
        );

        const session = await account.createEmailPasswordSession(
          email,
          password
        );

        setCookie(c, AUTH_COOKIE, session.secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        });
      } catch (error) {
        console.error(error);
        return c.json({ success: false });
      }

      return c.json({ success: true });
    }
  )
  .post(
    "/register-admin",
    zValidator("json", RegisterAdminSchema),
    async (c) => {
      try {
        const { token, name, email, password } = c.req.valid("json");
        const { users, account, databases } = await createAdminClient();

        // Vérification du token
        if (token !== "1234") {
          throw new HTTPException(400, { message: "invalid_invitation_token" });
        }

        // Création de l'utilisateur
        let user;
        try {
          user = await users.create(
            ID.unique(),
            email,
            undefined, // Phone is undefined
            password,
            name
          );
        } catch (error) {
          switch (error instanceof Error && "code" in error ? error.code : 0) {
            case 409: //Code 409 is for conflict in appwrite
              throw new HTTPException(400, {
                message: "already_used_email",
              });
            default:
              throw new HTTPException(400, {
                message: "cannot_create_user",
              });
          }
        }

        // Ajout de l'utilisateur au groupe admin
        try {
          await users.updateLabels(user.$id, ["admin"]);
        } catch (error) {
          throw new HTTPException(400, {
            message: "cannot_add_user_to_admin_group",
          });
        }

        // Création de session
        let session;
        try {
          session = await account.createEmailPasswordSession(email, password);
        } catch (error) {
          throw new HTTPException(400, {
            message: "cannot_create_session",
          });
        }

        // Configuration du cookie
        setCookie(c, AUTH_COOKIE, session.secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        });

        return c.json({ success: true, message: "register_success" });
      } catch (error) {
        // Renvoie une réponse JSON avec le message d'erreur
        const status = error instanceof HTTPException ? error.status : 500;
        const message =
          error instanceof Error ? error.message : "internal_error";
        return c.json({ success: false, message }, status);
      }
    }
  )
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return c.json({ success: true });
  });

export default app;
