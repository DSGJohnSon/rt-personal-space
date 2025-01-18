import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetTokens = () => {
  const query = useQuery({
    queryKey: ["current-tokens"],
    queryFn: async () => {
      const response = await client.api.token["current-tokens"].$get();

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
