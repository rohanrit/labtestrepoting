"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export type Horse = {
  _id: string;
  name: string;
  breed?: string;
  age?: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
};

export const useHorses = () => {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHorses = async () => {
      setLoading(true);
      setError(null);

      try {
        const session = await authClient.getSession();
        if (!session) throw new Error("Unauthorized");

        const res = await fetch("/api/horses", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch horses");
        const data = await res.json();
        setHorses(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchHorses();
  }, []);

  return { horses, loading, error };
};
