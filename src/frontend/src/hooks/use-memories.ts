import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SortBy as SortByEnum, createActor } from "../backend";
import type {
  CreateMemoryArgs,
  Memory,
  MemoryId,
  SortBy,
  UpdateMemoryArgs,
} from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyActor = Record<string, (...args: any[]) => Promise<any>>;

export function useMemories(sortBy: SortBy = SortByEnum.date) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Memory[]>({
    queryKey: ["memories", JSON.stringify(sortBy)],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as AnyActor).listMemories(sortBy) as Promise<
        Memory[]
      >;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMemory(id: MemoryId | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Memory | undefined>({
    queryKey: ["memory", id?.toString() ?? "null"],
    queryFn: async () => {
      if (!actor || id === null) return undefined;
      return (actor as unknown as AnyActor).getMemory(id) as Promise<
        Memory | undefined
      >;
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateMemory() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<MemoryId, Error, CreateMemoryArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as unknown as AnyActor).createMemory(
        args,
      ) as Promise<MemoryId>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });
}

export function useUpdateMemory() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, UpdateMemoryArgs>({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as unknown as AnyActor).updateMemory(
        args,
      ) as Promise<boolean>;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
      queryClient.invalidateQueries({
        queryKey: ["memory", variables.id.toString()],
      });
    },
  });
}

export function useDeleteMemory() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, MemoryId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as unknown as AnyActor).deleteMemory(
        id,
      ) as Promise<boolean>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });
}
