import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferResponseType, InferRequestType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { errorMessages, sucessMessages } from "@/data/data";

type ResponseType = InferResponseType<
  (typeof client.api.token)["unban-token"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.token)["unban-token"]["$post"]
>;

export const useUnbanAdmin = (token: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const tokenToUnBan = token;

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api.token["unban-token"]["$post"]({
        json: { token: tokenToUnBan },
      });
      return await response.json();
    },
    onSuccess: (response) => {
      if (response.success) {
        const traductedSucessMessage = sucessMessages.find(
          (item) => item.code === response.message
        );
        if (!traductedSucessMessage) {
          toast.success(response.message); //afficher le message par défaut
        } else {
          toast.success(traductedSucessMessage.en); //afficher le message de succès personnalisé
        }
      } else {
        const traductedError = errorMessages.find(
          (item) => item.code === response.message
        );
        if (!traductedError) {
          toast.error(response.message); //afficher le message d'erreur par défaut
        } else {
          toast.error(traductedError.en); //afficher le message d'erreur personnalisé
        }
      }
      queryClient.invalidateQueries({ queryKey: ["current-tokens"] });
      router.refresh();
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
