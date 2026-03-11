import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function usePrescriptions() {
  return useQuery({
    queryKey: ["/api/doctors/prescriptions"],
    queryFn: async () => {
      const res = await fetch("/api/doctors/prescriptions");
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      return res.json();
    },
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/doctors/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create prescription");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors/prescriptions"] });
    },
  });
}
