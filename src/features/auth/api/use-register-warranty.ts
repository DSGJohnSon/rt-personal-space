/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferResponseType, InferRequestType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { errorMessages, sucessMessages } from "@/data/data";

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
    onSuccess: (response) => {
      const traductedSucessMessage = sucessMessages.find(
        (item) => item.code === response.message
      );
      if (!traductedSucessMessage) {
        toast.success(response.message); //afficher le message par défaut
      } else {
        toast.success(traductedSucessMessage.fr); //afficher le message de succès personnalisé
      }
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (error: Error) => {
      //Récupérer le message d'erreur personnalisé
      const traductedError = errorMessages.find(
        (item) => item.code === error.message
      );
      if (!traductedError) {
        toast.error(error.message); //afficher le message d'erreur par défaut
      } else {
        toast.error(traductedError.en); //afficher le message d'erreur personnalisé
      }
    },
  });

  return mutation;
};
