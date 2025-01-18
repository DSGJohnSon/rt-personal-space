import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { errorMessages, sucessMessages } from "@/data/data";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();
      return await response.json();
    },
    onSuccess: (response) => {
      if (response.success) {
        const traductedSucessMessage = sucessMessages.find(
          (item) => item.code === "logout_success"
        );
        if (!traductedSucessMessage) {
          toast.success("logout_success"); //afficher le message par défaut
        } else {
          toast.success(traductedSucessMessage.en); //afficher le message de succès personnalisé
        }
      } else {
        const traductedError = errorMessages.find(
          (item) => item.code === "logout_failed"
        );
        if (!traductedError) {
          toast.error("logout_failed"); //afficher le message d'erreur par défaut
        } else {
          toast.error(traductedError.en); //afficher le message d'erreur personnalisé
        }
      }
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Failed to log out");
    },
  });

  return mutation;
};
