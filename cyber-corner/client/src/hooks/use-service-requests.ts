import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ServiceRequest } from "@shared/schema";

export function useServiceRequests() {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/requests"],
    queryFn: async () => {
      const res = await fetch("/api/requests", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes?: string }) => {
      const res = await apiRequest("PATCH", `/api/requests/${id}`, { status, adminNotes });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/requests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/analytics"] });
    },
  });

  return { requests, isLoading, updateRequest: updateMutation.mutateAsync, deleteRequest: deleteMutation.mutateAsync };
}

export function useNotices() {
  const queryClient = useQueryClient();

  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["/api/notices"],
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    queryFn: async () => {
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Failed to fetch notices");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Handle both JSON and FormData
      const isFormData = data instanceof FormData;
      const res = await fetch("/api/notices", {
        method: "POST",
        body: isFormData ? data : JSON.stringify(data),
        headers: isFormData ? {} : { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to create notice");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notices"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/notices/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notices"] }),
  });

  return { notices, isLoading, createNotice: createMutation.mutateAsync, deleteNotice: deleteMutation.mutateAsync };
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });
}
