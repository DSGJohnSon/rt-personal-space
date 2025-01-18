import { Client, Databases, Query } from "node-appwrite";
import { ADMIN_INVITE_TOKEN_ID, DATABASE_ID } from "@/config";

export type UserAdmin = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: "invited" | "registered" | "banned";
  email: string;
};

export const getTokens = async (): Promise<UserAdmin[]> => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const db = new Databases(client);
    const tokens = await db.listDocuments(DATABASE_ID, ADMIN_INVITE_TOKEN_ID, [
      Query.select(["$id", "$createdAt", "$updatedAt", "status", "email"]),
    ]);

    const formattedTokens: UserAdmin[] = tokens.documents.map((doc) => ({
      id: doc.$id,
      createdAt: new Date(doc.$createdAt),
      updatedAt: new Date(doc.$updatedAt),
      status: doc.status,
      email: doc.email,
    }));

    return formattedTokens;
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return [];
  }
};
