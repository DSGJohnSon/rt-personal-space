import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "./constants";

export const getCurrent = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies().get(AUTH_COOKIE);

    if (!session) {
      return null;
    }

    client.setSession(session.value);

    const account = new Account(client);

    return await account.get();
  } catch {
    return null;
  }
};

export const getUserInfo = async (userId: string) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const db = new Databases(client);
    const userInfo = await db.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_USERINFO_COLLECTION!,
      [
        Query.select([
          "civility",
          "firstname",
          "phone",
          "birthDate",
          "country",
          "serial",
          "placeOfPurchase",
          "purchaseDate",
          "terms",
          "requestWarranty",
        ]),
        Query.equal("userId", [userId]),
      ] // queries (optional)
    );

    return userInfo.documents[0];
  } catch {
    return null;
  }
};
