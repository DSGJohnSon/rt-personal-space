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
import { ID, Query } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware, sessionMiddlewareForBanned } from "@/lib/session-middleware";
import { HTTPException } from "hono/http-exception";
import { ADMIN_INVITE_TOKEN_ID, DATABASE_ID, USER_INFO_ID } from "@/config";

const app = new Hono()
  // Récupération de l'utilisateur actuel
  .get("/current", sessionMiddlewareForBanned, async (c) => {
    const user = c.get("user");

    return c.json({ data: user });
  })
  // Connexion
  .post("/login", zValidator("json", LoginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const { account } = await createAdminClient();

    try {
      try {
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
        console.log(error);
        switch (error instanceof Error && "type" in error ? error.type : 0) {
          case "user_invalid_credentials": //Code for invalid credentials in appwrite
            throw new HTTPException(400, {
              message: "user_invalid_credentials",
            });
          case "general_argument_invalid":
            throw new HTTPException(400, {
              message: "general_argument_invalid",
            });
          default:
            throw new HTTPException(400, {
              message: "internal_error",
            });
        }
      }
    } catch (error) {
      // Renvoie une réponse JSON avec le message d'erreur
      const status = error instanceof HTTPException ? error.status : 500;
      const message = error instanceof Error ? error.message : "internal_error";
      return c.json({ success: false, message }, status);
    }

    return c.json({ success: true, message: "login_success" });
  })
  // Création d'un utilisateur
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

        // Création de l'utilisateur
        try {
          const user = await account.create(ID.unique(), email, password, name);
          const userInfo = await databases.createDocument(
            DATABASE_ID,
            USER_INFO_ID,
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

        // Création de session
        let session;
        try {
          session = await account.createEmailPasswordSession(email, password);
        } catch (error) {
          throw new HTTPException(400, {
            message: "cannot_create_session",
          });
        }

        setCookie(c, AUTH_COOKIE, session.secret, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        });
      } catch (error) {
        // Renvoie une réponse JSON avec le message d'erreur
        const status = error instanceof HTTPException ? error.status : 500;
        const message =
          error instanceof Error ? error.message : "internal_error";
        return c.json({ success: false, message }, status);
      }

      return c.json({ success: true, message: "register_success" });
    }
  )
  // Création d'un administrateur
  .post(
    "/register-admin",
    zValidator("json", RegisterAdminSchema),
    async (c) => {
      try {
        const { token, name, email, password } = c.req.valid("json");
        const { users, account, databases } = await createAdminClient();

        const tokenWaited = await databases.listDocuments(
          DATABASE_ID,
          ADMIN_INVITE_TOKEN_ID,
          [Query.equal("email", email)]
        );
        //Si pas de token trouvé
        if (tokenWaited.total === 0) {
          throw new HTTPException(400, {
            message: "no_admin_invitation_found",
          });
        }
        //Si le token est banni
        if (tokenWaited.documents[0].status === "banned") {
          throw new HTTPException(400, {
            message: "banned_invitation_token",
          });
        }
        // Vérification du token
        if (token !== tokenWaited.documents[0].$id) {
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

          //Update du token pour le passer en register
          await databases.updateDocument(
            DATABASE_ID,
            ADMIN_INVITE_TOKEN_ID,
            tokenWaited.documents[0].$id,
            {
              status: "register",
            }
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
      } catch (error) {
        // Renvoie une réponse JSON avec le message d'erreur
        const status = error instanceof HTTPException ? error.status : 500;
        const message =
          error instanceof Error ? error.message : "internal_error";
        return c.json({ success: false, message }, status);
      }

      return c.json({ success: true, message: "register_success" });
    }
  )
  // Déconnexion
  .post("/logout", sessionMiddlewareForBanned, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return c.json({ success: true });
  });

export default app;
