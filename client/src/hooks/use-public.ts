import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useSearchDoctors(query: string) {
  return useQuery({
    queryKey: ["/api/public/search", query],
    queryFn: async () => {
      const url = query ? `/api/public/search?q=${encodeURIComponent(query)}` : "/api/public/search";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: true,
  });
}

export function useDoctorDetails(license: string) {
  return useQuery({
    queryKey: ["/api/public/doctor", license],
    queryFn: async () => {
      const res = await fetch(`/api/public/doctor/${encodeURIComponent(license)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch doctor details");
      return res.json();
    },
    enabled: !!license,
  });
}

export function useLogScan() {
  return useMutation({
    mutationFn: async (data: { licenseNumber: string; deviceType?: string; scannerLocation?: string }) => {
      const res = await fetch("/api/public/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to log scan");
      return res.json();
    }
  });
}

export function useApply() {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/applications/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Application failed to submit");
      }
      return res.json();
    }
  });
}

export function useTrackApplication(applicationId: string) {
  return useQuery({
    queryKey: ["/api/applications/track", applicationId],
    queryFn: async () => {
      const res = await fetch(`/api/applications/track/${encodeURIComponent(applicationId)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to track application");
      return res.json();
    },
    enabled: !!applicationId,
    retry: false,
  });
}
