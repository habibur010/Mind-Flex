import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertMoodLog } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useMoodLogs() {
  return useQuery({
    queryKey: [api.mood.list.path],
    queryFn: async () => {
      const res = await fetch(api.mood.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch mood logs");
      return api.mood.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMoodLog() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertMoodLog) => {
      const res = await fetch(api.mood.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to log mood");
      return api.mood.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.mood.list.path] });
      toast({ title: "Mood Logged", description: "Thanks for checking in with yourself." });
    },
  });
}
