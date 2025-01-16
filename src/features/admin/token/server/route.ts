/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AddNewAdminSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { sessionAdminMiddleware } from "@/lib/session-middleware";
import { HTTPException } from "hono/http-exception";
import { ADMIN_INVITE_TOKEN_ID, DATABASE_ID } from "@/config";

const app = new Hono()
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
  );

export default app;
