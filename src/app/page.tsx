"use client";

import { useEffect, useState } from "react";
import { getEntries } from "@/lib/db";
import { Box, Typography } from "@mui/material";
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
    <Box>
      <Typography variant="h2" mb={1}>
        Overview of Symptoms
      </Typography>
      <Calendar entries={entries} />
    </Box>
  );
}
