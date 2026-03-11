import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useApplications() {
  return useQuery({
    queryKey: ["/api/applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, reviewNotes }: { id: number; status: string; reviewNotes?: string }) => {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNotes }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
  });
}

export function useAdminDoctors() {
  return useQuery({
    queryKey: ["/api/doctors"],
    queryFn: async () => {
      const res = await fetch("/api/doctors");
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return res.json();
    },
  });
}

export function useUpdateDoctorStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, verificationStatus }: { id: number; verificationStatus: string }) => {
      const res = await fetch(`/api/doctors/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus }),
      });
      if (!res.ok) throw new Error("Failed to update doctor status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      // Invalidate public search as well to reflect changes immediately
      queryClient.invalidateQueries({ queryKey: ["/api/public/search"] });
    },
  });
}

export function useAdminScans() {
  return useQuery({
    queryKey: ["/api/admin/scans"],
    queryFn: async () => {
      const res = await fetch("/api/admin/scans");
      if (!res.ok) throw new Error("Failed to fetch scans");
      return res.json();
    },
  });
}
