import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertHealthData } from "@shared/schema";

export function useHealthData() {
  return useQuery({
    queryKey: [api.health.list.path],
    queryFn: async () => {
      const res = await fetch(api.health.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch health data");
      return api.health.list.responses[200].parse(await res.json());
    },
  });
}

export function useSyncHealthData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertHealthData) => {
      const res = await fetch(api.health.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to sync health data");
      return api.health.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.health.list.path] });
    },
  });
}
