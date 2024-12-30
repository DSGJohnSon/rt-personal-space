/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferResponseType, InferRequestType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["register-warranty"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["register-warranty"]["$post"]
>;

export const useRegisterWarranty = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["register-warranty"]["$post"]({
        json,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData); // Log the error response
        throw new Error(`Error: ${errorData}`);
      }

      console.log("response", response);

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Registered successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to register");
    },
  });

  return mutation;
};
