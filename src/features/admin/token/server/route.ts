/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AddNewAdminSchema, BanTokenSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { sessionAdminMiddleware } from "@/lib/session-middleware";
import { HTTPException } from "hono/http-exception";
import { ADMIN_INVITE_TOKEN_ID, DATABASE_ID } from "@/config";
import { UserAdmin } from "@/app/admin/(admin settings)/users/columns";

const app = new Hono()
  // Récupération de l'utilisateur actuel
  .get("/current-tokens", sessionAdminMiddleware, async (c) => {
    const { databases } = await createAdminClient();
    const tokens = await databases.listDocuments(DATABASE_ID, ADMIN_INVITE_TOKEN_ID, [
      Query.select(["$id", "$createdAt", "$updatedAt", "status", "email"]),
    ]);

    // Transform the data into the required format
    const formattedTokens: UserAdmin[] = tokens.documents.map((doc) => ({
      id: doc.$id,
      createdAt: new Date(doc.$createdAt),
      updatedAt: new Date(doc.$updatedAt),
      status: doc.status,
      email: doc.email,
    }));

    return c.json({ data: formattedTokens });
  })
  // Création d'un utilisateur
  .post(
    "/add-new-admin",
    sessionAdminMiddleware,
    zValidator("json", AddNewAdminSchema),
    async (c) => {
      const { email } = c.req.valid("json");

      try {
        const { databases, users } = await createAdminClient();

        //Vérifier si le mail est déjà utilisé par un client ou admin
        const userAlreadyExists = await users.list([
          Query.equal("email", email),
        ]);
        if (userAlreadyExists.total > 0) {
          return c.json({
            success: false,
            message: "user_already_exists",
            invitationLink: null,
          });
        }

        //Vérifier si le mail est déjà utilisé par une invitation admin
        const inviteAlreadyExists = await databases.listDocuments(
          DATABASE_ID,
          ADMIN_INVITE_TOKEN_ID,
          [Query.equal("email", email)]
        );
        if (inviteAlreadyExists.total > 0) {
          return c.json({
            success: false,
            message: "admin_invite_already_exists",
            invitationLink: null,
          });
        }

        //Enregistrer le token dans la base de données
        try {
          const invitation = await databases.createDocument(
            DATABASE_ID,
            ADMIN_INVITE_TOKEN_ID,
            ID.unique(),
            {
              email: email,
            }
          );
          return c.json({
            success: true,
            message: "invite_admin_success",
            invitationLink: `${process.env
              .NEXT_PUBLIC_APP_URL!}/admin-sign-up?token=${
              invitation.$id
            }&email=${email}`,
          });
        } catch (error) {
          throw new HTTPException(400, {
            message: "cannot_create_admin_invitation",
          });
        }
      } catch (error) {
        // Renvoie une réponse JSON avec le message d'erreur
        const status = error instanceof HTTPException ? error.status : 500;
        const message =
          error instanceof Error ? error.message : "internal_error";
        return c.json(
          { success: false, message, invitationLink: null },
          status
        );
      }
    }
  )
  //Ban d'un utilisateur/token
  .post(
    "/ban-token",
    zValidator("json", BanTokenSchema),
    sessionAdminMiddleware,
    async (c) => {
      const { token } = c.req.valid("json");
      try {
        const { users, databases } = await createAdminClient();
        //Récupérer les infos relatives à ce token
        const tokenDoc = await databases.getDocument(
          DATABASE_ID,
          ADMIN_INVITE_TOKEN_ID,
          token
        );
        if (!tokenDoc) {
          throw new HTTPException(404, { message: "token_not_found" });
        }
        if (tokenDoc.status === "banned") {
          throw new HTTPException(400, { message: "token_already_banned" });
        }

        //Vérifier si le token est lié à un utilisateur existant, si oui le bannir
        const userAlreadyExists = await users.list([
          Query.equal("email", tokenDoc.email),
        ]);
        if (userAlreadyExists.total > 0) {
          //Bannir le user
          users.updateLabels(
            userAlreadyExists.users[0].$id, // userId
            [...userAlreadyExists.users[0].labels, "banned"] // labels
          );
        }

        //Update le token en banned
        await databases.updateDocument(
          DATABASE_ID,
          ADMIN_INVITE_TOKEN_ID,
          token,
          {
            status: "banned",
          }
        );
        return c.json({ success: true, message: "token_banned" });
      } catch (error) {
        const status = error instanceof HTTPException ? error.status : 500;
        const message =
          error instanceof Error ? error.message : "internal_error";
        return c.json({ success: false, message }, status);
      }
    }
  )
  // Unban d'un utilisateur/token
  .post(
    "/unban-token",
    zValidator("json", BanTokenSchema),
    sessionAdminMiddleware,
    async (c) => {
      const { token } = c.req.valid("json");
      try {
        const { users, databases } = await createAdminClient();
        //Récupérer les infos relatives à ce token
        const tokenDoc = await databases.getDocument(
          DATABASE_ID,
          ADMIN_INVITE_TOKEN_ID,
          token
        );
        if (!tokenDoc) {
          throw new HTTPException(404, { message: "token_not_found" });
        }
        if (tokenDoc.status === "invited" || tokenDoc.status === "registered") {
          throw new HTTPException(400, { message: "token_not_banned" });
        }

        //Vérifier si le token est lié à un utilisateur existant, si oui le unban
        const userAlreadyExists = await users.list([
          Query.equal("email", tokenDoc.email),
        ]);
        if (userAlreadyExists.total > 0) {
          //Unbannir le user
          const newLabels = userAlreadyExists.users[0].labels.filter(
            (label: string) => label !== "banned"
          );
          users.updateLabels(
            userAlreadyExists.users[0].$id, // userId
            [...newLabels] // labels
          );
        }

        //Update le token en registered ou invited selon s'il avait été utilisé (présence d'un user signifie token utilisé)
        if (userAlreadyExists.total > 0) {
          await databases.updateDocument(
            DATABASE_ID,
            ADMIN_INVITE_TOKEN_ID,
            token,
            {
              status: "registered",
            }
          );
        } else {
          await databases.updateDocument(
            DATABASE_ID,
            ADMIN_INVITE_TOKEN_ID,
            token,
            {
              status: "invited",
            }
          );
        }
        return c.json({ success: true, message: "token_unbanned" });
      } catch (error) {
        const status = error instanceof HTTPException ? error.status : 500;
        const message =
          error instanceof Error ? error.message : "internal_error";
        return c.json({ success: false, message }, status);
      }
    }
  );

export default app;
