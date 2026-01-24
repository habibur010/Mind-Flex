import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useUserStats() {
  return useQuery({
    queryKey: [api.user.stats.path],
    queryFn: async () => {
      const res = await fetch(api.user.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.user.stats.responses[200].parse(await res.json());
    },
  });
}

export function useUserBadges() {
  return useQuery({
    queryKey: [api.user.badges.path],
    queryFn: async () => {
      const res = await fetch(api.user.badges.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch badges");
      return api.user.badges.responses[200].parse(await res.json());
    },
  });
}
