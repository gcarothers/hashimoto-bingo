"use client";

import { useEffect, useState } from "react";
import { getEntries } from "@/lib/db";
import { SymptomEntry } from "@/types";
import Calendar from "@/components/Calendar";

export default function Home() {
  const [entries, setEntries] = useState<SymptomEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      const data = await getEntries();
      setEntries(data);
      setLoading(false);
    };
    loadEntries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Symptom Calendar</h2>
      </div>
      <Calendar entries={entries} />
    </div>
  );
}
