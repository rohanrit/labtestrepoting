"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export type Report = {
  _id: string;
  horse: {
    _id: string;
    name: string;
    breed?: string;
  };
  uploadedBy: string;
  role: string;
  fileUrl: string;
  reportType: "blood" | "chemical";
  createdAt: string;
};

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const session = await authClient.getSession();
        if (!session) throw new Error("Unauthorized");

        const res = await fetch("/api/reports", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setReports(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { reports, loading, error };
};
