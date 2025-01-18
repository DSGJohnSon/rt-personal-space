import { z } from "zod";

export const AddNewAdminSchema = z.object({
  email: z.string().email(),
});

export const BanTokenSchema = z.object({
  token: z.string(),
});
