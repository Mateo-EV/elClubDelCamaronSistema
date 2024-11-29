import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";
import SuperJSON from "superjson";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
      mutations: {
        onError: (error) => {
          if (
            error instanceof TRPCClientError &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            error.data.code === "BAD_REQUEST"
          ) {
            toast.error(error.message ? error.message : "Algo salió mal");
          } else toast.error("Algo salió mal");
        },
      },
    },
  });
